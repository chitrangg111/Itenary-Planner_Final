import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { getAccuratePhotoUrl } from "./src/utils/photoResolver";
import { synthesizeTripItinerary } from "./src/utils/tripSynthesizer";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // CORS middleware to allow Android APK and external web clients
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, X-Requested-With, Accept");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini AI
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  // Reusable function with active models, fast retry & graceful model fallbacks
  async function generateWithRetry(params: any, maxRetries = 1) {
    const models = ["gemini-3.6-flash", "gemini-3.8-flash", "gemini-2.5-flash"];
    let lastError: any = null;

    for (const modelName of models) {
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const response = await ai.models.generateContent({
            ...params,
            model: modelName,
          });
          return response;
        } catch (err: any) {
          lastError = err;
          const errMsg = err?.message || String(err);
          const isTransient =
            errMsg.includes("503") ||
            errMsg.includes("429") ||
            errMsg.includes("UNAVAILABLE") ||
            errMsg.includes("high demand") ||
            errMsg.includes("RESOURCE_EXHAUSTED") ||
            err?.status === 503 ||
            err?.status === 429;

          console.warn(`[Gemini API] ${modelName} attempt ${attempt + 1} failed: ${errMsg}`);

          if (isTransient && attempt < maxRetries) {
            // Quick delay (400ms) before retrying same model
            await new Promise((resolve) => setTimeout(resolve, 400));
            continue;
          }
          break; // Try next model in list
        }
      }
    }
    throw lastError;
  }

  // Healthcheck endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "AI Travel Planner" });
  });

  // AI Concierge chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          reply: `I'm Lumi, your AI travel concierge! (${message}). I can help you plan custom day-by-day itineraries, adjust your budget, and discover top local spots!`,
          previewCard: {
            title: "Custom Exploration Route",
            badge: "AI Recommendation",
            duration: "3.5 hours",
            imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80"
          }
        });
      }

      const response = await generateWithRetry({
        contents: [
          {
            role: "user",
            parts: [{ text: message }]
          }
        ],
        config: {
          systemInstruction:
            "You are Lumi, an expert AI travel concierge tailored specifically for Indian travelers and cost-sensitive explorers. Whenever you suggest or discuss places, itineraries, or travel queries, ALWAYS mention which public transport modes can be used (e.g. local trains, metros, public buses with route numbers, Kaali-Peeli taxis, shared autos, ferries, trams, cable cars, walking routes). List all applicable public transport at each place and give explicit point-to-point route guidance (e.g. 'To go from Gateway of India to Marine Drive: Board BEST Bus #103 from Regal Cinema bus stop (~10 mins, ₹15), or take a Kaali-Peeli Taxi (~₹40, 7 mins), or take a scenic 15-min walk via Colaba Causeway.'). Format your answers clearly with headings or bullet points for mobile UI screens."
        }
      });

      const replyText = response.text || "I've processed your travel request!";

      return res.json({
        reply: replyText
      });
    } catch (err: any) {
      console.error("Gemini API Error in /api/chat:", err?.message || err);
      // Return helpful fallback response with public transport guidance
      return res.json({
        reply: `I'm currently assisting many travelers! Here is quick guidance for public transport:\n\n• **Gateway of India to Marine Drive (Mumbai)**: Take BEST Bus #103 or #138 from Regal Cinema stop (~10 mins, ₹15) or Kaali-Peeli Taxi (~₹40, 7 mins).\n• **Kyoto**: Take Kyoto City Bus #205 or JR Nara Line.\n• **Switzerland**: Use SBB CFF FFS Swiss Travel Pass / Cable Cars.\n\nAsk me any question or tell me where you'd like to travel next!`
      });
    }
  });

  // JSON cleaner & parser
  function cleanAndParseJson(raw: string) {
    if (!raw) return null;
    let text = raw.trim();
    if (text.startsWith("```json")) {
      text = text.slice(7);
    } else if (text.startsWith("```")) {
      text = text.slice(3);
    }
    if (text.endsWith("```")) {
      text = text.slice(0, -3);
    }
    text = text.trim();
    try {
      return JSON.parse(text);
    } catch (e) {
      const firstBrace = text.indexOf("{");
      const lastBrace = text.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        return JSON.parse(text.substring(firstBrace, lastBrace + 1));
      }
      throw e;
    }
  }

  // Real-time AI Trip Generation endpoint
  app.post("/api/generate-trip", async (req, res) => {
    const { from, destination, departure, days, budgetINR, travellers, tripStartTime, tripEndTime } = req.body || {};
    const targetDest = destination || "Kyoto, Japan";
    const daysCount = Math.min(Math.max(Number(days) || 3, 1), 10);
    const departureDate = departure || "Next Month";

    const getReliableFallback = () => {
      try {
        return synthesizeTripItinerary({
          destination: targetDest,
          from: from || "Current Location",
          departure: departureDate,
          days: daysCount,
          budgetINR: budgetINR || "50,000",
          travellers: travellers || "2 Travellers",
          tripStartTime,
          tripEndTime,
        });
      } catch (e) {
        return createFallbackResponse(targetDest, departureDate, daysCount);
      }
    };

    if (!process.env.GEMINI_API_KEY) {
      return res.json(getReliableFallback());
    }

    try {
      const prompt = `Craft a realistic, authentic ${daysCount}-day travel itinerary for ${targetDest} departing from ${from || "Indian Major City"} for ${travellers || "2 Travellers"} with a budget of ₹${budgetINR || "50,000"}.
User Preferred Whole Trip Start Time: ${tripStartTime || "06:30 AM (Day 1 Departure)"}
User Preferred Whole Trip End Time: ${tripEndTime || "09:45 PM (Day " + daysCount + " Return)"}

Focus strictly from an Indian traveler's point of view with cost-sensitive optimization:
0. tripStartTime: Set exact departure/start time of the whole trip (e.g. "${tripStartTime || "06:30 AM (Day 1 Departure)"}") and tripEndTime: Set exact return/end time (e.g. "${tripEndTime || "09:45 PM (Day " + daysCount + " Return)"}").
1. Budget Breakdown summary in INR (₹): hotelsCost, foodCost, activitiesCost, transportCost, totalEstimatedCost.
2. 2 Recommended Hotels/Stays with name, rating, pricePerNight in INR, vibe, and imageUrl.
3. 2 Top Restaurants / Dining Spots (highlighting Pure Veg / Jain / regional dining options) with name, cuisine, specialty, and priceRange in INR.
4. Nearer Attractions (4 nearby spots to visit).
5. Day-by-day activities for Day 1 through Day ${daysCount} with Morning, Afternoon, Evening sections.
Each activity must include:
- id, title, time, duration, startTime, endTime
- costBadgeText (e.g. "Free", "₹200", "₹1,200") and costBadgeClass ("bg-emerald-100 text-emerald-800")
- description, localTip, openingHours, ticketPrice
- nearbyPlaces (array of 3 strings)
- recommendedRestaurant { name, cuisine, estimatedCost }
- transitInfo { recommendedMethod, applicablePublicTransport: string[], routeGuidance }
- tags: [{ icon: "camera", text: "Sightseeing", colorClass: "bg-blue-100 text-blue-800" }]

Return ONLY valid JSON matching this schema:
{
  "id": "trip-${Date.now()}",
  "destination": "${targetDest}",
  "dates": "${departureDate} • ${daysCount} Days",
  "from": "${from || 'Current Location'}",
  "travellers": "${travellers || '2 Travellers'}",
  "tripStartTime": "${tripStartTime || '06:30 AM (Day 1 Departure)'}",
  "tripEndTime": "${tripEndTime || '09:45 PM (Day ' + daysCount + ' Return)'}",
  "status": "Ongoing",
  "weather": { "temp": "25°C", "condition": "Sunny & Pleasant" },
  "budgetSummary": { "hotelsCost": "...", "foodCost": "...", "activitiesCost": "...", "transportCost": "...", "totalEstimatedCost": "..." },
  "hotels": [{ "name": "...", "rating": "4.7 ★", "pricePerNight": "₹...", "vibe": "...", "imageUrl": "" }],
  "restaurants": [{ "name": "...", "cuisine": "...", "specialty": "...", "priceRange": "₹..." }],
  "nearbyAttractions": ["...", "...", "...", "..."],
  "dayItineraries": [
    {
      "dayNumber": 1,
      "sections": [
        { "period": "Morning", "activities": [...] },
        { "period": "Afternoon", "activities": [...] },
        { "period": "Evening", "activities": [...] }
      ]
    }
  ]
}`;

      // 14-second race against timeout
      const aiPromise = generateWithRetry({
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are an expert AI travel curator tailored specifically for Indian travelers and cost-sensitive budget planning. Return only valid, rich JSON with exactly " + daysCount + " days in dayItineraries.",
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("AI generation timeout exceeded 14s")), 14000)
      );

      const response: any = await Promise.race([aiPromise, timeoutPromise]);
      const rawText = response?.text || "";
      const parsed = cleanAndParseJson(rawText);

      if (!parsed || !Array.isArray(parsed.dayItineraries) || parsed.dayItineraries.length === 0) {
        throw new Error("Parsed response missing dayItineraries");
      }

      const destName = parsed.destination || targetDest;
      parsed.destination = destName;
      
      // Ensure accurate photo for destination
      if (!parsed.imageUrl || parsed.imageUrl.includes('placeholder') || parsed.imageUrl === 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80') {
        parsed.imageUrl = getAccuratePhotoUrl(destName, 'destination');
      }

      // Ensure accurate photos for hotels and activities
      if (Array.isArray(parsed.hotels)) {
        parsed.hotels.forEach((h: any) => {
          h.imageUrl = getAccuratePhotoUrl(`${h.name} ${destName}`, 'hotel');
        });
      }

      if (Array.isArray(parsed.dayItineraries)) {
        parsed.dayItineraries.forEach((day: any) => {
          if (Array.isArray(day.sections)) {
            day.sections.forEach((sec: any) => {
              if (Array.isArray(sec.activities)) {
                sec.activities.forEach((act: any) => {
                  act.imageUrl = getAccuratePhotoUrl(`${act.title} ${destName}`, 'activity');
                });
              }
            });
          }
        });
      }

      if (!parsed.id) {
        parsed.id = `trip-${Date.now()}`;
      }
      if (!parsed.status) {
        parsed.status = "Ongoing";
      }
      return res.json(parsed);
    } catch (err: any) {
      console.warn("[Server] Real-time AI generation fallback triggered:", err?.message || err);
      return res.json(getReliableFallback());
    }
  });

  // Vite middleware setup for Development / Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

function createFallbackResponse(destination: string, departure: string, daysCount: number) {
  const norm = destination.toLowerCase();
  let img = getAccuratePhotoUrl(destination, 'destination');

  return {
    id: `trip-${Date.now()}`,
    destination: destination || "Kyoto, Japan",
    dates: departure ? `${departure} • ${daysCount} Days` : `Next Month • ${daysCount} Days`,
    travellers: "2 Travellers",
    status: "Ongoing",
    imageUrl: img,
    weather: { temp: "24°C", condition: "Sunny & Pleasant" },
    budgetSummary: {
      hotelsCost: "₹38,000",
      foodCost: "₹19,500",
      activitiesCost: "₹11,000",
      transportCost: "₹7,500",
      totalEstimatedCost: "₹76,000 (~$915 USD)",
    },
    hotels: [
      {
        name: `Grand Palace ${destination}`,
        rating: "4.8 ★",
        pricePerNight: "₹11,800 / night",
        vibe: "Luxury Heritage Stay with Pool & Spa",
        imageUrl: getAccuratePhotoUrl(`${destination} hotel`, 'hotel'),
      },
      {
        name: `${destination} Boutique Suites`,
        rating: "4.6 ★",
        pricePerNight: "₹6,500 / night",
        vibe: "Cozy Modern Design in City Center",
        imageUrl: getAccuratePhotoUrl(`${destination} stay`, 'hotel'),
      },
    ],
    restaurants: [
      {
        name: `${destination} Gourmet Kitchen`,
        cuisine: "Local Heritage & Artisanal Dishes",
        specialty: "Chef's Signature Tasting Platter",
        priceRange: "₹2,800 for two",
      },
      {
        name: "Central Square Bistro",
        cuisine: "International & Local Fusion",
        specialty: "Woodfired Grill & Craft Drinks",
        priceRange: "₹1,500 for two",
      },
    ],
    nearbyAttractions: [`${destination} Central Plaza`, `${destination} Historic Garden`, "Riverfront Promenade", "Old Quarter Market"],
    dayItineraries: Array.from({ length: daysCount }).map((_, idx) => ({
      dayNumber: idx + 1,
      sections: [
        {
          period: "Morning",
          activities: [
            {
              id: `act-${idx + 1}-1`,
              title: `${destination} Premier City Tour & Landmark Walk`,
              time: "09:00 AM • 2.5 hrs",
              duration: "2.5 hrs",
              costBadgeText: "Free Entry",
              costBadgeClass: "bg-emerald-100 text-emerald-800",
              description: `Discover the top iconic sights, vibrant culture, and historic architecture of ${destination}.`,
              imageUrl: getAccuratePhotoUrl(`${destination} landmark`, 'activity'),
              openingHours: "8:00 AM - 6:00 PM",
              ticketPrice: "Free Entry / ₹50 for Museum",
              tags: [
                { icon: "camera", text: "Top Spot", colorClass: "bg-blue-50 text-blue-700" },
                { icon: "trees", text: "Sightseeing", colorClass: "bg-green-50 text-green-700" }
              ],
              localTip: '"Arrive early to avoid queues and catch the best morning sunlight for photos."',
              nearbyPlaces: [`${destination} Heritage Gate`, `${destination} Cultural Museum`, "Crafts Alley"],
              recommendedRestaurant: {
                name: `${destination} Morning Cafe`,
                cuisine: "Artisanal Breakfast & Espresso",
                estimatedCost: "₹550 (~$7 USD)"
              },
              transitInfo: {
                recommendedMethod: `City Bus / Metro Line or Local Taxi`,
                applicablePublicTransport: [
                  `City Express Bus (Central Stop)`,
                  `Metro / Rapid Transit Line`,
                  `Local Rail Station (1.2 km)`,
                  `Shared Auto & Taxi`
                ],
                routeGuidance: `To travel around ${destination}: Board the local Express Bus or Metro Line from the main station (~10-15 mins, ₹20), or take a local taxi (~₹80).`
              }
            }
          ]
        },
        {
          period: "Afternoon",
          activities: [
            {
              id: `act-${idx + 1}-2`,
              title: `Local Culinary Experience in ${destination}`,
              time: "01:30 PM • 2.0 hrs",
              duration: "2.0 hrs",
              costBadgeText: "Moderate",
              costBadgeClass: "bg-blue-100 text-blue-800",
              description: `Indulge in authentic local dishes, artisanal cafe specialties, and street food favorites.`,
              imageUrl: getAccuratePhotoUrl(`${destination} local food`, 'activity'),
              openingHours: "11:00 AM - 10:30 PM",
              ticketPrice: "₹200 - ₹500 per meal",
              tags: [
                { icon: "utensils", text: "Local Dining", colorClass: "bg-amber-50 text-amber-700" }
              ],
              transitInfo: {
                recommendedMethod: "Local Metro / Shared Taxi",
                applicablePublicTransport: [
                  "City Bus Loop",
                  "Metro Station (300m walk)",
                  "Auto Rickshaw / Taxi"
                ],
                routeGuidance: "To reach the culinary district: Take the city metro line or a 5-minute auto-rickshaw ride (~₹40)."
              }
            }
          ]
        },
        {
          period: "Evening",
          activities: [
            {
              id: `act-${idx + 1}-3`,
              title: `Sunset Walk & Night Promenade in ${destination}`,
              time: "06:00 PM • 2.5 hrs",
              duration: "2.5 hrs",
              costBadgeText: "Free",
              costBadgeClass: "bg-emerald-100 text-emerald-800",
              description: `Stroll through illuminated evening markets, waterside promenades, and lively cultural districts.`,
              imageUrl: getAccuratePhotoUrl(`${destination} sunset promenade`, 'activity'),
              openingHours: "5:00 PM - 11:00 PM",
              ticketPrice: "Free Public Access",
              tags: [
                { icon: "moon", text: "Evening Atmosphere", colorClass: "bg-purple-50 text-purple-700" }
              ],
              transitInfo: {
                recommendedMethod: "Public Transit / Coastal Walk",
                applicablePublicTransport: [
                  "Waterfront Shuttle Bus",
                  "Metro / Suburban Rail",
                  "Pedestrian Promenade Walk"
                ],
                routeGuidance: "Take the evening waterfront shuttle or enjoy a scenic 15-minute walk along the illuminated pedestrian boulevard."
              }
            }
          ]
        }
      ]
    }))
  };
}
