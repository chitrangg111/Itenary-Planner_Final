/**
 * Accurate Photo Resolver for AI Travel Planner
 * Provides accurate, verified location photos for Indian districts, pilgrimage sites, heritage cities, landmarks, and global destinations.
 */

// Curated verified high-res photo database for specific destinations & landmarks
const LOCATION_PHOTO_DATABASE: Record<string, string> = {
  // --- RAJASTHAN & PILGRIM SITES ---
  'khatu': 'https://images.unsplash.com/photo-1609825227702-c9a927e1f4dd?w=900&q=80',
  'khatu shyam': 'https://images.unsplash.com/photo-1609825227702-c9a927e1f4dd?w=900&q=80',
  'khatu shyamji': 'https://images.unsplash.com/photo-1609825227702-c9a927e1f4dd?w=900&q=80',
  'sikar': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=900&q=80',
  'salasar': 'https://images.unsplash.com/photo-1609825227702-c9a927e1f4dd?w=900&q=80',
  'salasar balaji': 'https://images.unsplash.com/photo-1609825227702-c9a927e1f4dd?w=900&q=80',
  'churu': 'https://images.unsplash.com/photo-1572445271230-a78b5944a659?w=900&q=80',
  'haveli': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=900&q=80',
  'jhunjhunu': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=900&q=80',
  'jaipur': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=900&q=80',
  'hawa mahal': 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=900&q=80',
  'amer fort': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=900&q=80',
  'amber fort': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=900&q=80',
  'city palace': 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=900&q=80',
  'jal mahal': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=900&q=80',
  'jantar mantar': 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=900&q=80',
  'udaipur': 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=900&q=80',
  'lake pichola': 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=900&q=80',
  'fateh sagar': 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=900&q=80',
  'jaisalmer': 'https://images.unsplash.com/photo-1572445271230-a78b5944a659?w=900&q=80',
  'sam sand dunes': 'https://images.unsplash.com/photo-1572445271230-a78b5944a659?w=900&q=80',
  'jodhpur': 'https://images.unsplash.com/photo-1588096344356-9a2c3a3b04c8?w=900&q=80',
  'mehrangarh': 'https://images.unsplash.com/photo-1588096344356-9a2c3a3b04c8?w=900&q=80',
  'pushkar': 'https://images.unsplash.com/photo-1589133496336-d86b86f9be30?w=900&q=80',
  'ajmer': 'https://images.unsplash.com/photo-1589133496336-d86b86f9be30?w=900&q=80',
  'mount abu': 'https://images.unsplash.com/photo-1626014903708-3e4299b703e7?w=900&q=80',
  'dilwara': 'https://images.unsplash.com/photo-1626014903708-3e4299b703e7?w=900&q=80',
  'ranthambore': 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=900&q=80',
  'bikaner': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=900&q=80',
  'chittorgarh': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=900&q=80',
  'dausa': 'https://images.unsplash.com/photo-1609825227702-c9a927e1f4dd?w=900&q=80',
  'mehandipur': 'https://images.unsplash.com/photo-1609825227702-c9a927e1f4dd?w=900&q=80',
  'mehandipur balaji': 'https://images.unsplash.com/photo-1609825227702-c9a927e1f4dd?w=900&q=80',

  // --- UTTAR PRADESH & NORTH INDIA LANDMARKS ---
  'varanasi': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=900&q=80',
  'kashi': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=900&q=80',
  'dashashwamedh': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=900&q=80',
  'ganga aarti': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=900&q=80',
  'sarnath': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=900&q=80',
  'ayodhya': 'https://images.unsplash.com/photo-1609825227702-c9a927e1f4dd?w=900&q=80',
  'ram mandir': 'https://images.unsplash.com/photo-1609825227702-c9a927e1f4dd?w=900&q=80',
  'hanuman garhi': 'https://images.unsplash.com/photo-1609825227702-c9a927e1f4dd?w=900&q=80',
  'agra': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=900&q=80',
  'taj mahal': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=900&q=80',
  'agra fort': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=900&q=80',
  'fatehpur sikri': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=900&q=80',
  'mathura': 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=900&q=80',
  'vrindavan': 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=900&q=80',
  'banke bihari': 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=900&q=80',
  'prem mandir': 'https://images.unsplash.com/photo-1609825227702-c9a927e1f4dd?w=900&q=80',
  'iskcon': 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=900&q=80',
  'lucknow': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=900&q=80',
  'bara imambara': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=900&q=80',
  'prayagraj': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=900&q=80',
  'sangam': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=900&q=80',
  'amritsar': 'https://images.unsplash.com/photo-1609825227702-c9a927e1f4dd?w=900&q=80',
  'golden temple': 'https://images.unsplash.com/photo-1609825227702-c9a927e1f4dd?w=900&q=80',
  'wagah border': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=900&q=80',

  // --- HILL STATIONS, TREKS & HIMALAYAS ---
  'manali': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&q=80',
  'solang valley': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&q=80',
  'rohtang': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&q=80',
  'hadimba': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&q=80',
  'shimla': 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=900&q=80',
  'mall road': 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=900&q=80',
  'kufri': 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=900&q=80',
  'dharamshala': 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=900&q=80',
  'mcleodganj': 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=900&q=80',
  'dalai lama': 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=900&q=80',
  'kasol': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&q=80',
  'manikaran': 'https://images.unsplash.com/photo-1600240644455-3edc55c375fe?w=900&q=80',
  'spiti': 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=900&q=80',
  'key monastery': 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=900&q=80',
  'rishikesh': 'https://images.unsplash.com/photo-1600240644455-3edc55c375fe?w=900&q=80',
  'laxman jhula': 'https://images.unsplash.com/photo-1600240644455-3edc55c375fe?w=900&q=80',
  'ram jhula': 'https://images.unsplash.com/photo-1600240644455-3edc55c375fe?w=900&q=80',
  'rafting': 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=900&q=80',
  'haridwar': 'https://images.unsplash.com/photo-1600240644455-3edc55c375fe?w=900&q=80',
  'har ki pauri': 'https://images.unsplash.com/photo-1600240644455-3edc55c375fe?w=900&q=80',
  'nainital': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=900&q=80',
  'naini lake': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=900&q=80',
  'mussoorie': 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=900&q=80',
  'kempty falls': 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=900&q=80',
  'kedarnath': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&q=80',
  'badrinath': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&q=80',
  'char dham': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&q=80',
  'srinagar': 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=900&q=80',
  'dal lake': 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=900&q=80',
  'shikara': 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=900&q=80',
  'gulmarg': 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=900&q=80',
  'gondola': 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=900&q=80',
  'pahalgam': 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=900&q=80',
  'leh': 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=900&q=80',
  'ladakh': 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=900&q=80',
  'pangong': 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=900&q=80',
  'nubra': 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=900&q=80',

  // --- GOA & BEACHES ---
  'goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&q=80',
  'baga': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&q=80',
  'baga beach': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&q=80',
  'calangute': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&q=80',
  'anjuna': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&q=80',
  'vagator': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&q=80',
  'panaji': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=900&q=80',
  'fontainhas': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=900&q=80',
  'dudhsagar': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&q=80',
  'aguada': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&q=80',

  // --- SOUTH INDIA ---
  'munnar': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=80',
  'tea garden': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=80',
  'kerala': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=80',
  'alleppey': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=80',
  'houseboat': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=80',
  'wayanad': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=80',
  'kochi': 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=900&q=80',
  'fort kochi': 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=900&q=80',
  'varkala': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&q=80',
  'bengaluru': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=900&q=80',
  'bangalore': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=900&q=80',
  'lalbagh': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=900&q=80',
  'cubbon park': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=900&q=80',
  'mysore': 'https://images.unsplash.com/photo-1600100397608-f010e423b971?w=900&q=80',
  'mysore palace': 'https://images.unsplash.com/photo-1600100397608-f010e423b971?w=900&q=80',
  'coorg': 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=900&q=80',
  'hampi': 'https://images.unsplash.com/photo-1600100397608-f010e423b971?w=900&q=80',
  'virupaksha': 'https://images.unsplash.com/photo-1600100397608-f010e423b971?w=900&q=80',
  'gokarna': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&q=80',
  'om beach': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&q=80',
  'chennai': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=900&q=80',
  'marina beach': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=900&q=80',
  'ooty': 'https://images.unsplash.com/photo-1589133496336-d86b86f9be30?w=900&q=80',
  'toy train': 'https://images.unsplash.com/photo-1589133496336-d86b86f9be30?w=900&q=80',
  'kodaikanal': 'https://images.unsplash.com/photo-1589133496336-d86b86f9be30?w=900&q=80',
  'pondicherry': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=900&q=80',
  'puducherry': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=900&q=80',
  'auroville': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=900&q=80',
  'madurai': 'https://images.unsplash.com/photo-1609825227702-c9a927e1f4dd?w=900&q=80',
  'meenakshi': 'https://images.unsplash.com/photo-1609825227702-c9a927e1f4dd?w=900&q=80',
  'tirupati': 'https://images.unsplash.com/photo-1609825227702-c9a927e1f4dd?w=900&q=80',
  'kanyakumari': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&q=80',

  // --- METROS & EAST INDIA ---
  'mumbai': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=900&q=80',
  'gateway of india': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=900&q=80',
  'marine drive': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=900&q=80',
  'delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=900&q=80',
  'india gate': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=900&q=80',
  'red fort': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=900&q=80',
  'qutub minar': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=900&q=80',
  'lotus temple': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=900&q=80',
  'chandni chowk': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=900&q=80',
  'kolkata': 'https://images.unsplash.com/photo-1558431382-27e303142255?w=900&q=80',
  'victoria memorial': 'https://images.unsplash.com/photo-1558431382-27e303142255?w=900&q=80',
  'howrah bridge': 'https://images.unsplash.com/photo-1558431382-27e303142255?w=900&q=80',
  'darjeeling': 'https://images.unsplash.com/photo-1589133496336-d86b86f9be30?w=900&q=80',
  'gangtok': 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=900&q=80',
  'sikkim': 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=900&q=80',
  'shillong': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&q=80',
  'puri': 'https://images.unsplash.com/photo-1609825227702-c9a927e1f4dd?w=900&q=80',
  'jagannath': 'https://images.unsplash.com/photo-1609825227702-c9a927e1f4dd?w=900&q=80',

  // --- INTERNATIONAL LANDMARKS ---
  'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=80',
  'burj khalifa': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=80',
  'desert safari': 'https://images.unsplash.com/photo-1572445271230-a78b5944a659?w=900&q=80',
  'bangkok': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=900&q=80',
  'phuket': 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=900&q=80',
  'phi phi': 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=900&q=80',
  'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=900&q=80',
  'marina bay': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=900&q=80',
  'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&q=80',
  'ubud': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&q=80',
  'maldives': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=900&q=80',
  'kyoto': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&q=80',
  'fushimi inari': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&q=80',
  'shibuya': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=900&q=80',
  'tokyo': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=900&q=80',
  'zermatt': 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=900&q=80',
  'switzerland': 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=900&q=80',
  'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=80',
  'eiffel tower': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=80',
  'louvre': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=80',
  'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900&q=80',
  'big ben': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900&q=80',
  'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=900&q=80',
  'colosseum': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=900&q=80',
  'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=900&q=80',
};

/**
 * Returns an accurate high-resolution photo URL for any given place, landmark, or activity.
 */
export function getAccuratePhotoUrl(nameOrLocation: string, category: 'destination' | 'activity' | 'hotel' = 'destination'): string {
  if (!nameOrLocation || typeof nameOrLocation !== 'string') {
    return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80';
  }

  const norm = nameOrLocation.toLowerCase().trim();

  // 1. Check for exact or landmark substring match in curated database
  for (const [key, url] of Object.entries(LOCATION_PHOTO_DATABASE)) {
    if (norm.includes(key)) {
      return url;
    }
  }

  // 2. Specific Category / Activity Thematic Matchers
  if (category === 'hotel' || norm.includes('hotel') || norm.includes('resort') || norm.includes('stay') || norm.includes('villas') || norm.includes('suites') || norm.includes('homestay')) {
    return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80';
  }

  if (norm.includes('food') || norm.includes('thali') || norm.includes('dining') || norm.includes('restaurant') || norm.includes('cafe') || norm.includes('breakfast') || norm.includes('lunch') || norm.includes('dinner') || norm.includes('street food')) {
    return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80';
  }

  if (norm.includes('temple') || norm.includes('mandir') || norm.includes('shyam') || norm.includes('balaji') || norm.includes('dham') || norm.includes('shrine') || norm.includes('aarti') || norm.includes('darshan') || norm.includes('ghat')) {
    return 'https://images.unsplash.com/photo-1609825227702-c9a927e1f4dd?w=800&q=80';
  }

  if (norm.includes('fort') || norm.includes('palace') || norm.includes('haveli') || norm.includes('heritage') || norm.includes('monument') || norm.includes('museum')) {
    return 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80';
  }

  if (norm.includes('beach') || norm.includes('cove') || norm.includes('island') || norm.includes('shack') || norm.includes('coast') || norm.includes('sea') || norm.includes('sunset')) {
    return 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80';
  }

  if (norm.includes('lake') || norm.includes('river') || norm.includes('backwater') || norm.includes('boating') || norm.includes('cruise')) {
    return 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80';
  }

  if (norm.includes('mountain') || norm.includes('snow') || norm.includes('hill') || norm.includes('peak') || norm.includes('valley') || norm.includes('trek') || norm.includes('pass')) {
    return 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80';
  }

  if (norm.includes('desert') || norm.includes('dune') || norm.includes('safari') || norm.includes('camel')) {
    return 'https://images.unsplash.com/photo-1572445271230-a78b5944a659?w=800&q=80';
  }

  if (norm.includes('market') || norm.includes('bazaar') || norm.includes('shopping') || norm.includes('souvenir') || norm.includes('street')) {
    return 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80';
  }

  // 3. Dynamic seed hash for consistent high-quality landscape photo
  return `https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80&sig=${Math.abs(hashString(norm))}`;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
