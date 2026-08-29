import React, { useState, useRef, useEffect } from 'react';
import { RecentTrip, DreamDestination } from '../types';
import { SafeImage } from './SafeImage';

interface LocationItem {
  id: string;
  name: string;
  country: string;
  district?: string;
  state?: string;
  code?: string;
  type: 'City' | 'Airport' | 'Resort' | 'Island' | 'Region' | 'District' | 'Pilgrimage';
}

const POPULAR_LOCATIONS: LocationItem[] = [
  // --- METRO & TIER-1 ORIGIN HUBS (INDIA) ---
  { id: 'del', name: 'New Delhi / NCR (DEL)', country: 'India', state: 'Delhi NCR', code: 'DEL', type: 'Airport' },
  { id: 'bom', name: 'Mumbai (BOM)', country: 'India', district: 'Mumbai City', state: 'Maharashtra', code: 'BOM', type: 'Airport' },
  { id: 'blr', name: 'Bengaluru / Bangalore (BLR)', country: 'India', district: 'Bengaluru Urban', state: 'Karnataka', code: 'BLR', type: 'Airport' },
  { id: 'hyd', name: 'Hyderabad (HYD)', country: 'India', district: 'Hyderabad', state: 'Telangana', code: 'HYD', type: 'Airport' },
  { id: 'maa', name: 'Chennai (MAA)', country: 'India', district: 'Chennai', state: 'Tamil Nadu', code: 'MAA', type: 'Airport' },
  { id: 'ccu', name: 'Kolkata (CCU)', country: 'India', district: 'Kolkata', state: 'West Bengal', code: 'CCU', type: 'Airport' },
  { id: 'amd', name: 'Ahmedabad (AMD)', country: 'India', district: 'Ahmedabad', state: 'Gujarat', code: 'AMD', type: 'Airport' },
  { id: 'pnq', name: 'Pune (PNQ)', country: 'India', district: 'Pune', state: 'Maharashtra', code: 'PNQ', type: 'Airport' },
  { id: 'jai', name: 'Jaipur (JAI)', country: 'India', district: 'Jaipur', state: 'Rajasthan', code: 'JAI', type: 'Airport' },
  { id: 'lko', name: 'Lucknow (LKO)', country: 'India', district: 'Lucknow', state: 'Uttar Pradesh', code: 'LKO', type: 'Airport' },
  { id: 'ixc', name: 'Chandigarh (IXC)', country: 'India', state: 'Punjab & Haryana', code: 'IXC', type: 'Airport' },
  { id: 'stv', name: 'Surat (STV)', country: 'India', district: 'Surat', state: 'Gujarat', code: 'STV', type: 'Airport' },
  { id: 'cok', name: 'Kochi / Ernakulam (COK)', country: 'India', district: 'Ernakulam', state: 'Kerala', code: 'COK', type: 'Airport' },
  { id: 'idr', name: 'Indore (IDR)', country: 'India', district: 'Indore', state: 'Madhya Pradesh', code: 'IDR', type: 'Airport' },
  { id: 'nag', name: 'Nagpur (NAG)', country: 'India', district: 'Nagpur', state: 'Maharashtra', code: 'NAG', type: 'Airport' },
  { id: 'bho', name: 'Bhopal (BHO)', country: 'India', district: 'Bhopal', state: 'Madhya Pradesh', code: 'BHO', type: 'Airport' },
  { id: 'vtz', name: 'Visakhapatnam (VTZ)', country: 'India', district: 'Visakhapatnam', state: 'Andhra Pradesh', code: 'VTZ', type: 'Airport' },
  { id: 'pat', name: 'Patna (PAT)', country: 'India', district: 'Patna', state: 'Bihar', code: 'PAT', type: 'Airport' },
  { id: 'bbi', name: 'Bhubaneswar (BBI)', country: 'India', district: 'Khurda', state: 'Odisha', code: 'BBI', type: 'Airport' },
  { id: 'gau', name: 'Guwahati (GAU)', country: 'India', district: 'Kamrup Metropolitan', state: 'Assam', code: 'GAU', type: 'Airport' },
  { id: 'ded', name: 'Dehradun (DED)', country: 'India', district: 'Dehradun', state: 'Uttarakhand', code: 'DED', type: 'Airport' },
  { id: 'rpr', name: 'Raipur (RPR)', country: 'India', district: 'Raipur', state: 'Chhattisgarh', code: 'RPR', type: 'Airport' },
  { id: 'ixr', name: 'Ranchi (IXR)', country: 'India', district: 'Ranchi', state: 'Jharkhand', code: 'IXR', type: 'Airport' },
  { id: 'cjb', name: 'Coimbatore (CJB)', country: 'India', district: 'Coimbatore', state: 'Tamil Nadu', code: 'CJB', type: 'Airport' },
  { id: 'atq', name: 'Amritsar (ATQ)', country: 'India', district: 'Amritsar', state: 'Punjab', code: 'ATQ', type: 'Airport' },
  { id: 'vga', name: 'Vijayawada (VGA)', country: 'India', district: 'NTR District', state: 'Andhra Pradesh', code: 'VGA', type: 'Airport' },

  // --- RAJASTHAN DISTRICTS & TOWNS ---
  { id: 'skr', name: 'Sikar (Khatu Shyamji Dham)', country: 'India', district: 'Sikar', state: 'Rajasthan', type: 'District' },
  { id: 'chu', name: 'Churu (Salasar Balaji & Tal Chhapar)', country: 'India', district: 'Churu', state: 'Rajasthan', type: 'District' },
  { id: 'jjn', name: 'Jhunjhunu (Rani Sati & Shekhawati Havelis)', country: 'India', district: 'Jhunjhunu', state: 'Rajasthan', type: 'District' },
  { id: 'nkt', name: 'Neem Ka Thana & Torawati', country: 'India', district: 'Neem Ka Thana', state: 'Rajasthan', type: 'District' },
  { id: 'bkn', name: 'Bikaner (Junagarh Fort & Karni Mata)', country: 'India', district: 'Bikaner', state: 'Rajasthan', code: 'BKB', type: 'District' },
  { id: 'udr', name: 'Udaipur (Lake Pichola & City Palace)', country: 'India', district: 'Udaipur', state: 'Rajasthan', code: 'UDR', type: 'City' },
  { id: 'jsm', name: 'Jaisalmer (Thar Desert Sand Dunes)', country: 'India', district: 'Jaisalmer', state: 'Rajasthan', type: 'District' },
  { id: 'jdh', name: 'Jodhpur (Mehrangarh Fort)', country: 'India', district: 'Jodhpur', state: 'Rajasthan', code: 'JDH', type: 'City' },
  { id: 'psk', name: 'Pushkar & Ajmer Sharif Dargah', country: 'India', district: 'Ajmer', state: 'Rajasthan', type: 'Pilgrimage' },
  { id: 'rtb', name: 'Ranthambore & Sawai Madhopur', country: 'India', district: 'Sawai Madhopur', state: 'Rajasthan', type: 'Region' },
  { id: 'mtu', name: 'Mount Abu & Dilwara Temples', country: 'India', district: 'Sirohi', state: 'Rajasthan', type: 'Region' },
  { id: 'alw', name: 'Alwar & Sariska Tiger Reserve', country: 'India', district: 'Alwar', state: 'Rajasthan', type: 'District' },
  { id: 'kta', name: 'Kota (Chambal Riverfront & Seven Wonders)', country: 'India', district: 'Kota', state: 'Rajasthan', type: 'City' },
  { id: 'btp', name: 'Bharatpur (Keoladeo Bird Sanctuary)', country: 'India', district: 'Bharatpur', state: 'Rajasthan', type: 'District' },
  { id: 'ctg', name: 'Chittorgarh Fort', country: 'India', district: 'Chittorgarh', state: 'Rajasthan', type: 'District' },
  { id: 'dsa', name: 'Dausa & Mehandipur Balaji Dham', country: 'India', district: 'Dausa', state: 'Rajasthan', type: 'Pilgrimage' },
  { id: 'kri', name: 'Karauli & Kaila Devi Temple', country: 'India', district: 'Karauli', state: 'Rajasthan', type: 'Pilgrimage' },
  { id: 'ngr', name: 'Nagaur (Nagaur Fort & Khimsar)', country: 'India', district: 'Nagaur', state: 'Rajasthan', type: 'District' },
  { id: 'pli', name: 'Pali & Ranakpur Jain Temple', country: 'India', district: 'Pali', state: 'Rajasthan', type: 'District' },
  { id: 'sgn', name: 'Sri Ganganagar & Hanumangarh', country: 'India', district: 'Sri Ganganagar', state: 'Rajasthan', type: 'District' },
  { id: 'bnd', name: 'Bundi & Tonk Heritage', country: 'India', district: 'Bundi', state: 'Rajasthan', type: 'District' },
  { id: 'bmr', name: 'Barmer & Balotra (Kiradu Temples)', country: 'India', district: 'Barmer', state: 'Rajasthan', type: 'District' },
  { id: 'rjs', name: 'Rajsamand & Nathdwara Shrinathji', country: 'India', district: 'Rajsamand', state: 'Rajasthan', type: 'Pilgrimage' },
  { id: 'bsw', name: 'Banswara & Dungarpur (100 Islands)', country: 'India', district: 'Banswara', state: 'Rajasthan', type: 'District' },
  { id: 'jlr', name: 'Jalore & Bhinmal Fort', country: 'India', district: 'Jalore', state: 'Rajasthan', type: 'District' },
  { id: 'ptg', name: 'Pratapgarh', country: 'India', district: 'Pratapgarh', state: 'Rajasthan', type: 'District' },
  { id: 'bwr', name: 'Beawar', country: 'India', district: 'Beawar', state: 'Rajasthan', type: 'District' },
  { id: 'pld', name: 'Phalodi', country: 'India', district: 'Phalodi', state: 'Rajasthan', type: 'District' },
  { id: 'kkr', name: 'Kekri', country: 'India', district: 'Kekri', state: 'Rajasthan', type: 'District' },
  { id: 'ddw', name: 'Didwana-Kuchaman', country: 'India', district: 'Didwana-Kuchaman', state: 'Rajasthan', type: 'District' },
  { id: 'ggp', name: 'Gangapur City', country: 'India', district: 'Gangapur City', state: 'Rajasthan', type: 'District' },
  { id: 'kpb', name: 'Kotputli-Behror', country: 'India', district: 'Kotputli-Behror', state: 'Rajasthan', type: 'District' },

  // --- PUNJAB & HARYANA DISTRICTS & CITIES ---
  { id: 'ptl', name: 'Patiala Heritage & Forts', country: 'India', district: 'Patiala', state: 'Punjab', type: 'District' },
  { id: 'btd', name: 'Bathinda Fort & Lakes', country: 'India', district: 'Bathinda', state: 'Punjab', type: 'District' },
  { id: 'jld', name: 'Jalandhar', country: 'India', district: 'Jalandhar', state: 'Punjab', type: 'City' },
  { id: 'ldh', name: 'Ludhiana', country: 'India', district: 'Ludhiana', state: 'Punjab', type: 'City' },
  { id: 'ptk', name: 'Pathankot', country: 'India', district: 'Pathankot', state: 'Punjab', type: 'City' },
  { id: 'ggn', name: 'Gurugram / Gurgaon', country: 'India', district: 'Gurugram', state: 'Haryana', type: 'City' },
  { id: 'fbd', name: 'Faridabad', country: 'India', district: 'Faridabad', state: 'Haryana', type: 'City' },
  { id: 'pnp', name: 'Panipat & Karnal', country: 'India', district: 'Panipat', state: 'Haryana', type: 'District' },
  { id: 'ksr', name: 'Kurukshetra (Brahma Sarovar)', country: 'India', district: 'Kurukshetra', state: 'Haryana', type: 'Pilgrimage' },
  { id: 'amb', name: 'Ambala', country: 'India', district: 'Ambala', state: 'Haryana', type: 'City' },
  { id: 'hsr', name: 'Hisar & Sirsa', country: 'India', district: 'Hisar', state: 'Haryana', type: 'District' },

  // --- UTTAR PRADESH & BIHAR CITIES & DISTRICTS ---
  { id: 'vns', name: 'Varanasi (Kashi Vishwanath & Ghats)', country: 'India', district: 'Varanasi', state: 'Uttar Pradesh', code: 'VNS', type: 'Pilgrimage' },
  { id: 'ayd', name: 'Ayodhya (Ram Mandir)', country: 'India', district: 'Ayodhya', state: 'Uttar Pradesh', code: 'AYJ', type: 'Pilgrimage' },
  { id: 'agr', name: 'Agra (Taj Mahal & Agra Fort)', country: 'India', district: 'Agra', state: 'Uttar Pradesh', code: 'AGR', type: 'City' },
  { id: 'mth', name: 'Mathura & Vrindavan', country: 'India', district: 'Mathura', state: 'Uttar Pradesh', type: 'Pilgrimage' },
  { id: 'knp', name: 'Kanpur', country: 'India', district: 'Kanpur Nagar', state: 'Uttar Pradesh', type: 'City' },
  { id: 'ald', name: 'Prayagraj / Allahabad (Sangam)', country: 'India', district: 'Prayagraj', state: 'Uttar Pradesh', type: 'Pilgrimage' },
  { id: 'gkp', name: 'Gorakhpur (Gorakhnath Temple)', country: 'India', district: 'Gorakhpur', state: 'Uttar Pradesh', code: 'GOP', type: 'City' },
  { id: 'mrt', name: 'Meerut', country: 'India', district: 'Meerut', state: 'Uttar Pradesh', type: 'City' },
  { id: 'bly', name: 'Bareilly & Moradabad', country: 'India', district: 'Bareilly', state: 'Uttar Pradesh', type: 'City' },
  { id: 'jhs', name: 'Jhansi Fort & Bundelkhand', country: 'India', district: 'Jhansi', state: 'Uttar Pradesh', type: 'District' },
  { id: 'mzb', name: 'Mirzapur & Vindhyachal', country: 'India', district: 'Mirzapur', state: 'Uttar Pradesh', type: 'Pilgrimage' },
  { id: 'gya', name: 'Bodh Gaya (Mahabodhi Temple)', country: 'India', district: 'Gaya', state: 'Bihar', code: 'GAY', type: 'Pilgrimage' },
  { id: 'mzp', name: 'Muzaffarpur', country: 'India', district: 'Muzaffarpur', state: 'Bihar', type: 'City' },
  { id: 'bgp', name: 'Bhagalpur', country: 'India', district: 'Bhagalpur', state: 'Bihar', type: 'City' },
  { id: 'dbg', name: 'Darbhanga', country: 'India', district: 'Darbhanga', state: 'Bihar', type: 'City' },
  { id: 'raj', name: 'Rajgir & Nalanda Ruins', country: 'India', district: 'Nalanda', state: 'Bihar', type: 'Pilgrimage' },

  // --- HIMACHAL & UTTARAKHAND HILL DISTRICTS ---
  { id: 'mnl', name: 'Manali & Solang Valley', country: 'India', district: 'Kullu', state: 'Himachal Pradesh', type: 'Region' },
  { id: 'sml', name: 'Shimla & Kufri', country: 'India', district: 'Shimla', state: 'Himachal Pradesh', type: 'District' },
  { id: 'mcl', name: 'Dharamshala & McLeod Ganj', country: 'India', district: 'Kangra', state: 'Himachal Pradesh', type: 'Region' },
  { id: 'spt', name: 'Spiti Valley & Kaza', country: 'India', district: 'Lahaul & Spiti', state: 'Himachal Pradesh', type: 'District' },
  { id: 'kas', name: 'Kasol & Tosh (Parvati Valley)', country: 'India', district: 'Kullu', state: 'Himachal Pradesh', type: 'Region' },
  { id: 'dlh', name: 'Dalhousie & Khajjiar', country: 'India', district: 'Chamba', state: 'Himachal Pradesh', type: 'Region' },
  { id: 'mnd', name: 'Mandi & Prashar Lake', country: 'India', district: 'Mandi', state: 'Himachal Pradesh', type: 'District' },
  { id: 'sln', name: 'Solan & Kasauli', country: 'India', district: 'Solan', state: 'Himachal Pradesh', type: 'District' },
  { id: 'rsk', name: 'Rishikesh & Haridwar', country: 'India', district: 'Dehradun / Haridwar', state: 'Uttarakhand', type: 'Pilgrimage' },
  { id: 'mus', name: 'Mussoorie & Dhanaulti', country: 'India', district: 'Dehradun', state: 'Uttarakhand', type: 'District' },
  { id: 'nai', name: 'Nainital & Bhimtal', country: 'India', district: 'Nainital', state: 'Uttarakhand', type: 'District' },
  { id: 'crb', name: 'Jim Corbett National Park', country: 'India', district: 'Nainital / Pauri', state: 'Uttarakhand', type: 'Region' },
  { id: 'aul', name: 'Auli Ski Resort', country: 'India', district: 'Chamoli', state: 'Uttarakhand', type: 'Resort' },
  { id: 'kdr', name: 'Kedarnath & Badrinath (Char Dham)', country: 'India', district: 'Rudraprayag / Chamoli', state: 'Uttarakhand', type: 'Pilgrimage' },
  { id: 'alm', name: 'Almora & Ranikhet', country: 'India', district: 'Almora', state: 'Uttarakhand', type: 'District' },

  // --- GOA DISTRICTS & BEACH DESTINATIONS ---
  { id: 'ngoX', name: 'North Goa (Calangute, Baga, Vagator, Anjuna)', country: 'India', district: 'North Goa', state: 'Goa', code: 'GOX', type: 'District' },
  { id: 'sgoI', name: 'South Goa (Palolem, Colva, Benaulim)', country: 'India', district: 'South Goa', state: 'Goa', code: 'GOI', type: 'District' },
  { id: 'pan', name: 'Panaji / Panjim', country: 'India', district: 'North Goa', state: 'Goa', type: 'City' },

  // --- KERALA DISTRICTS ---
  { id: 'mnr', name: 'Munnar Tea Gardens', country: 'India', district: 'Idukki', state: 'Kerala', type: 'District' },
  { id: 'alp', name: 'Alleppey / Alappuzha (Houseboats)', country: 'India', district: 'Alappuzha', state: 'Kerala', type: 'District' },
  { id: 'wyd', name: 'Wayanad (Waterfalls & Caves)', country: 'India', district: 'Wayanad', state: 'Kerala', type: 'District' },
  { id: 'vrk', name: 'Varkala & Kovalam Beaches', country: 'India', district: 'Thiruvananthapuram', state: 'Kerala', code: 'TRV', type: 'Region' },
  { id: 'tkd', name: 'Thekkady (Periyar Wildlife)', country: 'India', district: 'Idukki', state: 'Kerala', type: 'Region' },
  { id: 'kzk', name: 'Kozhikode / Calicut', country: 'India', district: 'Kozhikode', state: 'Kerala', type: 'City' },
  { id: 'tsr', name: 'Thrissur (Cultural Capital)', country: 'India', district: 'Thrissur', state: 'Kerala', type: 'City' },
  { id: 'knr', name: 'Kannur Beaches & Theyyam', country: 'India', district: 'Kannur', state: 'Kerala', type: 'District' },

  // --- MAHARASHTRA & GUJARAT DISTRICTS ---
  { id: 'nsk', name: 'Nashik (Sula Vineyards & Trimbakeshwar)', country: 'India', district: 'Nashik', state: 'Maharashtra', type: 'District' },
  { id: 'aur', name: 'Chhatrapati Sambhajinagar / Aurangabad (Ajanta Ellora)', country: 'India', district: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', code: 'IXU', type: 'District' },
  { id: 'mhb', name: 'Mahabaleshwar & Panchgani', country: 'India', district: 'Satara', state: 'Maharashtra', type: 'District' },
  { id: 'lnv', name: 'Lonavala & Khandala', country: 'India', district: 'Pune', state: 'Maharashtra', type: 'Region' },
  { id: 'klp_m', name: 'Kolhapur (Mahalakshmi Temple)', country: 'India', district: 'Kolhapur', state: 'Maharashtra', type: 'District' },
  { id: 'srd', name: 'Shirdi Sai Baba Temple', country: 'India', district: 'Ahmednagar', state: 'Maharashtra', type: 'Pilgrimage' },
  { id: 'rtg', name: 'Ratnagiri & Sindhudurg (Konkan Coast)', country: 'India', district: 'Ratnagiri', state: 'Maharashtra', type: 'District' },
  { id: 'sol', name: 'Solapur', country: 'India', district: 'Solapur', state: 'Maharashtra', type: 'City' },
  { id: 'raj_g', name: 'Rajkot', country: 'India', district: 'Rajkot', state: 'Gujarat', code: 'RAJ', type: 'City' },
  { id: 'bdq', name: 'Vadodara / Baroda', country: 'India', district: 'Vadodara', state: 'Gujarat', code: 'BDQ', type: 'City' },
  { id: 'bvn', name: 'Bhavnagar & Palitana Jain Temples', country: 'India', district: 'Bhavnagar', state: 'Gujarat', type: 'District' },
  { id: 'jga', name: 'Jamnagar & Dwarka (Dwarkadhish Temple)', country: 'India', district: 'Devbhumi Dwarka', state: 'Gujarat', type: 'Pilgrimage' },
  { id: 'jnd', name: 'Junagadh & Girnar Hill', country: 'India', district: 'Junagadh', state: 'Gujarat', type: 'District' },
  { id: 'ktc', name: 'Rann of Kutch (White Desert)', country: 'India', district: 'Kutch', state: 'Gujarat', type: 'District' },
  { id: 'sou', name: 'Statue of Unity (Kevadia)', country: 'India', district: 'Narmada', state: 'Gujarat', type: 'Region' },

  // --- KARNATAKA & TAMIL NADU DISTRICTS ---
  { id: 'mys', name: 'Mysuru / Mysore Palace', country: 'India', district: 'Mysuru', state: 'Karnataka', type: 'City' },
  { id: 'mgl', name: 'Mangaluru / Mangalore Beaches', country: 'India', district: 'Dakshina Kannada', state: 'Karnataka', code: 'IXE', type: 'City' },
  { id: 'crg', name: 'Coorg / Kodagu (Coffee Plantations)', country: 'India', district: 'Kodagu', state: 'Karnataka', type: 'District' },
  { id: 'ckm', name: 'Chikmagalur', country: 'India', district: 'Chikmagalur', state: 'Karnataka', type: 'District' },
  { id: 'hmp', name: 'Hampi Ruins (UNESCO)', country: 'India', district: 'Vijayanagara', state: 'Karnataka', type: 'Region' },
  { id: 'gkn', name: 'Gokarna Beach & Om Beach', country: 'India', district: 'Uttara Kannada', state: 'Karnataka', type: 'Region' },
  { id: 'mdu', name: 'Madurai (Meenakshi Amman Temple)', country: 'India', district: 'Madurai', state: 'Tamil Nadu', code: 'IXM', type: 'Pilgrimage' },
  { id: 'try', name: 'Tiruchirappalli / Trichy', country: 'India', district: 'Tiruchirappalli', state: 'Tamil Nadu', code: 'TRZ', type: 'City' },
  { id: 'oty', name: 'Ooty & Nilgiri Toy Train', country: 'India', district: 'The Nilgiris', state: 'Tamil Nadu', type: 'District' },
  { id: 'kdk', name: 'Kodaikanal Lake', country: 'India', district: 'Dindigul', state: 'Tamil Nadu', type: 'District' },
  { id: 'rsm', name: 'Rameswaram Temple & Dhanushkodi', country: 'India', district: 'Ramanathapuram', state: 'Tamil Nadu', type: 'Pilgrimage' },
  { id: 'kmk', name: 'Kanyakumari (Vivekananda Rock)', country: 'India', district: 'Kanyakumari', state: 'Tamil Nadu', type: 'District' },
  { id: 'tjv', name: 'Thanjavur (Brihadishvara Temple)', country: 'India', district: 'Thanjavur', state: 'Tamil Nadu', type: 'Pilgrimage' },
  { id: 'slm', name: 'Salem & Yercaud', country: 'India', district: 'Salem', state: 'Tamil Nadu', type: 'District' },

  // --- TELANGANA & ANDHRA PRADESH DISTRICTS ---
  { id: 'wgl', name: 'Warangal (Ramappa Temple)', country: 'India', district: 'Warangal', state: 'Telangana', type: 'District' },
  { id: 'nzb', name: 'Nizamabad', country: 'India', district: 'Nizamabad', state: 'Telangana', type: 'City' },
  { id: 'tup', name: 'Tirupati (Tirumala Balaji Temple)', country: 'India', district: 'Tirupati', state: 'Andhra Pradesh', code: 'TIR', type: 'Pilgrimage' },
  { id: 'kkd', name: 'Kakinada & Rajamahendravaram', country: 'India', district: 'Kakinada', state: 'Andhra Pradesh', type: 'District' },
  { id: 'gtr', name: 'Guntur & Vijayawada', country: 'India', district: 'Guntur', state: 'Andhra Pradesh', type: 'District' },
  { id: 'knl', name: 'Kurnool & Belum Caves', country: 'India', district: 'Kurnool', state: 'Andhra Pradesh', type: 'District' },

  // --- WEST BENGAL, ODISHA & NORTHEAST ---
  { id: 'slg', name: 'Siliguri & Jalpaiguri', country: 'India', district: 'Darjeeling / Jalpaiguri', state: 'West Bengal', code: 'IXB', type: 'City' },
  { id: 'drj', name: 'Darjeeling & Kurseong', country: 'India', district: 'Darjeeling', state: 'West Bengal', type: 'District' },
  { id: 'gtk', name: 'Gangtok, Nathula & Tsomgo Lake', country: 'India', district: 'East Sikkim', state: 'Sikkim', code: 'PYG', type: 'District' },
  { id: 'shl', name: 'Shillong & Cherrapunji', country: 'India', district: 'East Khasi Hills', state: 'Meghalaya', code: 'SHL', type: 'District' },
  { id: 'kzr', name: 'Kaziranga National Park', country: 'India', district: 'Golaghat', state: 'Assam', type: 'Region' },
  { id: 'pri', name: 'Puri (Jagannath Temple & Beach)', country: 'India', district: 'Puri', state: 'Odisha', type: 'Pilgrimage' },
  { id: 'ctk', name: 'Cuttack', country: 'India', district: 'Cuttack', state: 'Odisha', type: 'City' },
  { id: 'rkl', name: 'Rourkela', country: 'India', district: 'Sundargarh', state: 'Odisha', type: 'City' },

  // --- TOP GLOBAL CITIES & DESTINATIONS ---
  { id: 'dxb', name: 'Dubai & Abu Dhabi', country: 'United Arab Emirates', code: 'DXB', type: 'City' },
  { id: 'bkk', name: 'Bangkok & Pattaya', country: 'Thailand', code: 'BKK', type: 'City' },
  { id: 'hkt', name: 'Phuket & Krabi Islands', country: 'Thailand', code: 'HKT', type: 'Island' },
  { id: 'sin', name: 'Singapore City', country: 'Singapore', code: 'SIN', type: 'City' },
  { id: 'dps', name: 'Bali (Ubud, Kuta & Seminyak)', country: 'Indonesia', code: 'DPS', type: 'Island' },
  { id: 'kul', name: 'Kuala Lumpur & Genting Highlands', country: 'Malaysia', code: 'KUL', type: 'City' },
  { id: 'mle', name: 'Maldives Atolls & Island Resorts', country: 'Maldives', code: 'MLE', type: 'Island' },
  { id: 'ktm', name: 'Kathmandu & Pokhara', country: 'Nepal', code: 'KTM', type: 'City' },
  { id: 'bti', name: 'Thimphu & Paro Valley', country: 'Bhutan', code: 'PBH', type: 'City' },
  { id: 'cmb', name: 'Colombo, Kandy & Galle', country: 'Sri Lanka', code: 'CMB', type: 'Island' },
  { id: 'han', name: 'Hanoi & Halong Bay', country: 'Vietnam', code: 'HAN', type: 'City' },
  { id: 'dad', name: 'Da Nang & Hoi An', country: 'Vietnam', code: 'DAD', type: 'City' },
  { id: 'tas', name: 'Tashkent & Samarkand', country: 'Uzbekistan', code: 'TAS', type: 'City' },
  { id: 'gyd', name: 'Baku', country: 'Azerbaijan', code: 'GYD', type: 'City' },
  { id: 'tbs', name: 'Tbilisi & Batumi', country: 'Georgia', code: 'TBS', type: 'City' },
  { id: 'ala', name: 'Almaty', country: 'Kazakhstan', code: 'ALA', type: 'City' },
  { id: 'kyo', name: 'Kyoto & Osaka', country: 'Japan', type: 'City' },
  { id: 'tyo', name: 'Tokyo', country: 'Japan', code: 'TYO', type: 'City' },
  { id: 'zmt', name: 'Zermatt, Interlaken & Zurich', country: 'Switzerland', type: 'Resort' },
  { id: 'cdg', name: 'Paris & French Riviera', country: 'France', code: 'CDG', type: 'City' },
  { id: 'lhr', name: 'London & Edinburgh', country: 'United Kingdom', code: 'LHR', type: 'City' },
  { id: 'fco', name: 'Rome, Florence & Venice', country: 'Italy', code: 'FCO', type: 'City' },
  { id: 'ist', name: 'Istanbul & Cappadocia', country: 'Turkey', code: 'IST', type: 'City' },
  { id: 'bcn', name: 'Barcelona & Madrid', country: 'Spain', code: 'BCN', type: 'City' },
  { id: 'jfk', name: 'New York City (JFK)', country: 'United States', code: 'JFK', type: 'City' },
  { id: 'sfo', name: 'San Francisco & Los Angeles', country: 'United States', code: 'SFO', type: 'City' },
  { id: 'syd', name: 'Sydney & Melbourne', country: 'Australia', code: 'SYD', type: 'City' },
];

interface ExploreViewProps {
  userName?: string;
  recentTrips: RecentTrip[];
  dreamDestinations: DreamDestination[];
  onToggleBookmark: (id: string) => void;
  onGenerateTrip: (tripData: {
    from: string;
    destination: string;
    departure: string;
    days: number;
    budgetINR: string;
    travellers: string;
    tripStartTime?: string;
    tripEndTime?: string;
  }) => void;
  onStartChat: () => void;
  onSelectRecentTrip: (trip: RecentTrip) => void;
  isGenerating?: boolean;
  generationProgress?: number;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  userName = 'Alex',
  recentTrips,
  dreamDestinations,
  onToggleBookmark,
  onGenerateTrip,
  onStartChat,
  onSelectRecentTrip,
  isGenerating = false,
  generationProgress = 0,
}) => {
  const [from, setFrom] = useState('');
  const [destination, setDestination] = useState('');
  const [departure, setDeparture] = useState('2026-09-15');
  const [days, setDays] = useState(5);
  const [budgetINR, setBudgetINR] = useState('50,000');
  const [travellers, setTravellers] = useState('2 People');
  const [tripStartTime, setTripStartTime] = useState('06:30 AM');
  const [tripEndTime, setTripEndTime] = useState('09:45 PM');
  const [localGenerating, setLocalGenerating] = useState(false);

  // Suggestions state
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  const fromContainerRef = useRef<HTMLDivElement>(null);
  const destContainerRef = useRef<HTMLDivElement>(null);

  // Filter logic based on typed query with dynamic dynamic fallback for ANY user-typed city/district
  const getFilteredLocations = (query: string) => {
    const rawTrimmed = query.trim();
    const trimmed = rawTrimmed.toLowerCase();
    if (!trimmed) return POPULAR_LOCATIONS.slice(0, 10);

    const matches = POPULAR_LOCATIONS.filter(
      (loc) =>
        loc.name.toLowerCase().includes(trimmed) ||
        (loc.district && loc.district.toLowerCase().includes(trimmed)) ||
        (loc.state && loc.state.toLowerCase().includes(trimmed)) ||
        loc.country.toLowerCase().includes(trimmed) ||
        (loc.code && loc.code.toLowerCase().includes(trimmed)) ||
        loc.type.toLowerCase().includes(trimmed)
    );

    // If user typed something and it's not identical to the first matched location name, add a dynamic choice at top
    const exactMatch = matches.some((loc) => loc.name.toLowerCase() === trimmed);
    if (!exactMatch && rawTrimmed.length >= 2) {
      const dynamicCustomLocation: LocationItem = {
        id: `custom-${trimmed}`,
        name: rawTrimmed,
        district: 'City / District',
        country: 'Global Location',
        type: 'City',
      };
      return [dynamicCustomLocation, ...matches].slice(0, 12);
    }

    return matches.slice(0, 12);
  };

  const filteredFromLocations = getFilteredLocations(from);
  const filteredDestLocations = getFilteredLocations(destination);

  // Outside click listener to hide suggestion dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fromContainerRef.current && !fromContainerRef.current.contains(e.target as Node)) {
        setShowFromSuggestions(false);
      }
      if (destContainerRef.current && !destContainerRef.current.contains(e.target as Node)) {
        setShowDestSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowFromSuggestions(false);
    setShowDestSuggestions(false);
    onGenerateTrip({
      from: from || 'Current Location',
      destination: destination || 'Kyoto, Japan',
      departure,
      days,
      budgetINR,
      travellers,
      tripStartTime,
      tripEndTime,
    });
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setFrom('Getting location...');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFrom(`Current Location (${pos.coords.latitude.toFixed(1)}°, ${pos.coords.longitude.toFixed(1)}°)`);
          setShowFromSuggestions(false);
        },
        () => {
          setFrom('New Delhi, India');
          setShowFromSuggestions(false);
        }
      );
    } else {
      setFrom('New Delhi, India');
      setShowFromSuggestions(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Hero */}
      <section className="mb-2">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1a1b1f] tracking-tight">
          Hello, {userName || 'Traveler'}
        </h2>
        <p className="text-[#414755] text-lg mt-1 opacity-80">
          Where should we take you next?
        </p>
      </section>

      {/* Main Search Card (Bento-inspired Grid) */}
      <section className="bg-white border border-black/5 rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] overflow-visible relative">
        <form onSubmit={handleGenerate} className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="material-symbols-outlined text-[#0058bc] text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              explore
            </span>
            <h3 className="text-xl font-bold text-[#1a1b1f]">Plan Your Trip</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start / From Location Field with Autosuggestions */}
            <div className="space-y-1.5 relative" ref={fromContainerRef}>
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-[#414755]">From</label>
                {from && (
                  <button
                    type="button"
                    onClick={() => setFrom('')}
                    className="text-xs text-[#0058bc] font-semibold hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={from}
                  onFocus={() => {
                    setShowFromSuggestions(true);
                    setShowDestSuggestions(false);
                  }}
                  onChange={(e) => {
                    setFrom(e.target.value);
                    setShowFromSuggestions(true);
                  }}
                  placeholder="Type city or airport (e.g. New Delhi, Mumbai, London)"
                  className="w-full h-[54px] rounded-xl border border-[#c1c6d7]/60 bg-[#f4f3f8] px-4 pr-12 focus:ring-2 focus:ring-[#0058bc] focus:bg-white transition-all outline-none text-[#1a1b1f] font-medium text-sm md:text-base"
                />
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#717786] hover:text-[#0058bc] transition-colors cursor-pointer"
                  title="Use current GPS location"
                >
                  <span className="material-symbols-outlined text-xl">my_location</span>
                </button>
              </div>

              {/* Suggestions Dropdown for 'From' */}
              {showFromSuggestions && (
                <div className="absolute top-[100%] left-0 right-0 mt-1 bg-white border border-black/10 rounded-2xl shadow-xl z-50 overflow-hidden max-h-72 overflow-y-auto animate-in fade-in duration-150">
                  <div className="px-3 py-2 bg-[#f4f3f8] text-[11px] font-bold text-[#414755] uppercase tracking-wider flex justify-between items-center">
                    <span>{from.trim() ? 'Matching Origins & Airports' : 'Popular Departure Cities'}</span>
                    <span className="text-[10px] font-medium text-[#717786]">Click to select</span>
                  </div>

                  {filteredFromLocations.length > 0 ? (
                    filteredFromLocations.map((loc) => (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => {
                          if (loc.id.startsWith('custom-')) {
                            setFrom(loc.name);
                          } else {
                            const stateOrCountry = loc.state || loc.country;
                            setFrom(`${loc.name}, ${stateOrCountry}`);
                          }
                          setShowFromSuggestions(false);
                        }}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-[#0058bc]/5 transition-colors flex items-center justify-between group cursor-pointer border-b border-black/5 last:border-none"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="material-symbols-outlined text-[#0058bc] text-lg group-hover:scale-110 transition-transform shrink-0">
                            {loc.id.startsWith('custom-')
                              ? 'add_location_alt'
                              : loc.type === 'Airport'
                              ? 'flight_takeoff'
                              : loc.type === 'Pilgrimage'
                              ? 'temple_hindu'
                              : 'location_on'}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#1a1b1f] group-hover:text-[#0058bc] transition-colors truncate">
                              {loc.id.startsWith('custom-') ? `Use "${loc.name}"` : loc.name}
                            </p>
                            <p className="text-xs text-[#414755] truncate">
                              {loc.id.startsWith('custom-')
                                ? 'Custom City, Town or District'
                                : [loc.district ? `Dist: ${loc.district}` : null, loc.state, loc.country].filter(Boolean).join(' • ')}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#eeedf3] text-[#0058bc] shrink-0 ml-2">
                          {loc.id.startsWith('custom-') ? 'CUSTOM' : loc.type}
                        </span>
                      </button>
                    ))
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setShowFromSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-[#1a1b1f] hover:bg-[#0058bc]/5 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[#0058bc] text-base">
                        edit_location
                      </span>
                      <span>Use "{from}"</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Destination / Where To Field with Autosuggestions */}
            <div className="space-y-1.5 relative" ref={destContainerRef}>
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-[#414755]">Destination</label>
                {destination && (
                  <button
                    type="button"
                    onClick={() => setDestination('')}
                    className="text-xs text-[#0058bc] font-semibold hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={destination}
                  onFocus={() => {
                    setShowDestSuggestions(true);
                    setShowFromSuggestions(false);
                  }}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setShowDestSuggestions(true);
                  }}
                  placeholder="Where to? (e.g. North Goa, Manali, Munnar, Dubai)"
                  className="w-full h-[54px] rounded-xl border border-[#c1c6d7]/60 bg-[#f4f3f8] px-4 pr-12 focus:ring-2 focus:ring-[#0058bc] focus:bg-white transition-all outline-none text-[#1a1b1f] font-medium text-sm md:text-base"
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#717786]">
                  location_on
                </span>
              </div>

              {/* Suggestions Dropdown for 'Destination' */}
              {showDestSuggestions && (
                <div className="absolute top-[100%] left-0 right-0 mt-1 bg-white border border-black/10 rounded-2xl shadow-xl z-50 overflow-hidden max-h-72 overflow-y-auto animate-in fade-in duration-150">
                  <div className="px-3 py-2 bg-[#f4f3f8] text-[11px] font-bold text-[#414755] uppercase tracking-wider flex justify-between items-center">
                    <span>{destination.trim() ? 'Matching Places & Districts' : 'Trending Destinations'}</span>
                    <span className="text-[10px] font-medium text-[#717786]">Click to select</span>
                  </div>

                  {filteredDestLocations.length > 0 ? (
                    filteredDestLocations.map((loc) => (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => {
                          if (loc.id.startsWith('custom-')) {
                            setDestination(loc.name);
                          } else {
                            const stateOrCountry = loc.state || loc.country;
                            setDestination(`${loc.name}, ${stateOrCountry}`);
                          }
                          setShowDestSuggestions(false);
                        }}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-[#0058bc]/5 transition-colors flex items-center justify-between group cursor-pointer border-b border-black/5 last:border-none"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="material-symbols-outlined text-[#0058bc] text-lg group-hover:scale-110 transition-transform shrink-0">
                            {loc.id.startsWith('custom-')
                              ? 'add_location_alt'
                              : loc.type === 'Island'
                              ? 'beach_access'
                              : loc.type === 'Resort'
                              ? 'landscape'
                              : loc.type === 'Pilgrimage'
                              ? 'temple_hindu'
                              : 'flight_land'}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#1a1b1f] group-hover:text-[#0058bc] transition-colors truncate">
                              {loc.id.startsWith('custom-') ? `Use "${loc.name}"` : loc.name}
                            </p>
                            <p className="text-xs text-[#414755] truncate">
                              {loc.id.startsWith('custom-')
                                ? 'Custom City, Town or District'
                                : [loc.district ? `Dist: ${loc.district}` : null, loc.state, loc.country].filter(Boolean).join(' • ')}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#eeedf3] text-[#0058bc] shrink-0 ml-2">
                          {loc.id.startsWith('custom-') ? 'CUSTOM' : loc.type}
                        </span>
                      </button>
                    ))
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setShowDestSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-[#1a1b1f] hover:bg-[#0058bc]/5 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[#0058bc] text-base">
                        explore
                      </span>
                      <span>Plan trip to "{destination}"</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Origin & Destination Chips */}
          <div className="space-y-2 pt-1 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-[#414755] shrink-0">Popular Destinations:</span>
              {[
                { label: 'Sikar (Khatu Shyam)', val: 'Sikar (Khatu Shyamji Dham), Rajasthan' },
                { label: 'Churu (Salasar)', val: 'Churu (Salasar Balaji & Tal Chhapar), Rajasthan' },
                { label: 'North Goa', val: 'North Goa (Calangute, Baga), Goa' },
                { label: 'Manali', val: 'Manali & Solang Valley, Himachal Pradesh' },
                { label: 'Udaipur', val: 'Udaipur, Rajasthan' },
                { label: 'Munnar', val: 'Munnar Tea Gardens, Kerala' },
                { label: 'Leh Ladakh', val: 'Leh & Nubra Valley, Ladakh' },
                { label: 'Dubai', val: 'Dubai & Abu Dhabi, UAE' },
              ].map((dest) => (
                <button
                  key={dest.label}
                  type="button"
                  onClick={() => setDestination(dest.val)}
                  className="px-2.5 py-1 rounded-full bg-[#0058bc]/10 text-[#0058bc] font-semibold hover:bg-[#0058bc] hover:text-white transition-colors cursor-pointer"
                >
                  {dest.label}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Parameters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#414755] ml-1">Departure</label>
              <input
                type="date"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                className="w-full h-[54px] rounded-xl border border-[#c1c6d7]/60 bg-[#f4f3f8] px-3 focus:ring-2 focus:ring-[#0058bc] focus:bg-white transition-all outline-none font-medium text-[#1a1b1f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#414755] ml-1">Days</label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                  className="w-full h-[54px] rounded-xl border border-[#c1c6d7]/60 bg-[#f4f3f8] px-4 pr-14 focus:ring-2 focus:ring-[#0058bc] focus:bg-white transition-all outline-none font-medium text-[#1a1b1f]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#717786]">
                  DAYS
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#414755] ml-1">Budget (INR)</label>
              <div className="relative">
                <input
                  type="text"
                  value={budgetINR}
                  onChange={(e) => setBudgetINR(e.target.value)}
                  placeholder="₹50,000"
                  className="w-full h-[54px] rounded-xl border border-[#c1c6d7]/60 bg-[#f4f3f8] pl-8 pr-4 focus:ring-2 focus:ring-[#0058bc] focus:bg-white transition-all outline-none font-medium text-[#1a1b1f]"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-[#717786] font-medium">
                  ₹
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#414755] ml-1">Travellers</label>
              <select
                value={travellers}
                onChange={(e) => setTravellers(e.target.value)}
                className="w-full h-[54px] rounded-xl border border-[#c1c6d7]/60 bg-[#f4f3f8] px-4 focus:ring-2 focus:ring-[#0058bc] focus:bg-white transition-all outline-none font-medium text-[#1a1b1f] appearance-none cursor-pointer"
              >
                <option>1 Person</option>
                <option>2 People</option>
                <option>Group (4+)</option>
                <option>Family</option>
              </select>
            </div>
          </div>

          {/* Indian Cost Sensitivity Preset Pills */}
          <div className="bg-[#faf9fe] p-3 rounded-2xl border border-black/5 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#0058bc] uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">savings</span>
                Indian Traveler Budget Tier
              </span>
              <span className="text-[#717786]">Cost-conscious optimization</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Backpacker (₹18k)', val: '18,000' },
                { label: 'Comfort Family (₹35k)', val: '35,000' },
                { label: 'Standard (₹50k)', val: '50,000' },
                { label: 'Premium Holiday (₹90k)', val: '90,000' },
              ].map((tier, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setBudgetINR(tier.val)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    budgetINR === tier.val
                      ? 'bg-[#0058bc] text-white shadow-xs'
                      : 'bg-white text-[#414755] border border-black/10 hover:bg-[#0058bc]/5'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* User-defined Trip Timings (Start Time & End Time) */}
          <div className="bg-[#f0f4fa] p-4 rounded-2xl border border-blue-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#0058bc]">
              <span className="flex items-center gap-1.5 uppercase tracking-wider">
                <span className="material-symbols-outlined text-base text-[#0058bc]">schedule</span>
                Decide Trip Timings (Start & End)
              </span>
              <span className="text-[#515b70] text-[11px] font-normal">Custom Schedule</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Start Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1a1b1f] flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-emerald-600">flight_takeoff</span>
                  Whole Trip Start Time
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={tripStartTime}
                    onChange={(e) => setTripStartTime(e.target.value)}
                    placeholder="e.g. 06:30 AM"
                    className="w-full h-[46px] rounded-xl border border-[#c1c6d7]/80 bg-white px-3 pr-8 text-sm font-bold text-[#1a1b1f] focus:ring-2 focus:ring-[#0058bc] outline-none shadow-xs"
                  />
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-[#0058bc]">
                    play_circle
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {['06:00 AM', '07:30 AM', '09:00 AM', '10:30 AM'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTripStartTime(t)}
                      className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                        tripStartTime === t
                          ? 'bg-[#0058bc] text-white shadow-xs'
                          : 'bg-white text-[#414755] border border-black/10 hover:bg-[#0058bc]/10'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* End Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1a1b1f] flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-amber-600">flight_land</span>
                  Whole Trip End Time
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={tripEndTime}
                    onChange={(e) => setTripEndTime(e.target.value)}
                    placeholder="e.g. 09:45 PM"
                    className="w-full h-[46px] rounded-xl border border-[#c1c6d7]/80 bg-white px-3 pr-8 text-sm font-bold text-[#1a1b1f] focus:ring-2 focus:ring-[#0058bc] outline-none shadow-xs"
                  />
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-indigo-700">
                    task_alt
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {['08:00 PM', '09:30 PM', '10:00 PM', '11:00 PM'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTripEndTime(t)}
                      className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                        tripEndTime === t
                          ? 'bg-[#0058bc] text-white shadow-xs'
                          : 'bg-white text-[#414755] border border-black/10 hover:bg-[#0058bc]/10'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full h-[58px] bg-[#0058bc] text-white font-bold text-lg rounded-xl shadow-lg hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-75 relative overflow-hidden"
          >
            {isGenerating ? (
              <>
                <span className="material-symbols-outlined animate-spin text-2xl">sync</span>
                <span>Crafting Itinerary ({Math.round(generationProgress)}%)...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                <span>Generate Trip</span>
              </>
            )}
          </button>
        </form>
      </section>

      {/* Recent Trips (Horizontal Scroll) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#1a1b1f]">Recent Explorations</h3>
          <button className="text-[#0058bc] font-semibold text-sm flex items-center gap-1 hover:underline cursor-pointer">
            View All <span className="material-symbols-outlined text-base">chevron_right</span>
          </button>
        </div>

        <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-none snap-x">
          {recentTrips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => onSelectRecentTrip(trip)}
              className="flex-none w-72 snap-start cursor-pointer group"
            >
              <div className="relative h-48 rounded-2xl overflow-hidden mb-3 shadow-sm border border-black/5">
                <SafeImage
                  src={trip.imageUrl}
                  alt={trip.destination}
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  fallbackText="Destination Photo Unavailable"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold w-fit mb-1 ${
                      trip.status === 'Completed'
                        ? 'bg-[#6ffb85] text-[#00732a]'
                        : trip.status === 'Ongoing'
                        ? 'bg-[#0070eb] text-white'
                        : 'bg-[#e3e2e7] text-[#414755]'
                    }`}
                  >
                    {trip.status}
                  </span>
                </div>
              </div>
              <h4 className="font-bold text-lg text-[#1a1b1f] group-hover:text-[#0058bc] transition-colors">
                {trip.destination}
              </h4>
              <p className="text-[#414755] text-sm font-medium">
                {trip.dates} • {trip.travellers}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Saved Trips / Dream Destinations */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-[#1a1b1f]">Dream Destinations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dreamDestinations.map((dest) => (
            <div
              key={dest.id}
              className="flex items-center gap-4 p-4 bg-white border border-black/5 rounded-2xl hover:bg-[#f4f3f8] transition-colors group cursor-pointer shadow-sm"
            >
              <SafeImage
                src={dest.imageUrl}
                alt={dest.title}
                containerClassName="w-24 h-24 rounded-xl flex-none"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                fallbackText="No Photo"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-lg text-[#1a1b1f] truncate">
                    {dest.title}
                  </h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(dest.id);
                    }}
                    className="text-[#0058bc] p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <span
                      className="material-symbols-outlined text-2xl"
                      style={{ fontVariationSettings: dest.bookmarked ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      bookmark
                    </span>
                  </button>
                </div>
                <p className="text-[#414755] text-sm mt-1">
                  Estimated Budget: ₹{dest.estimatedBudgetINR.toLocaleString('en-IN')}
                </p>
                <div className="flex gap-2 mt-2">
                  {dest.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${tag.colorClass}`}
                    >
                      {tag.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Assistant Promo Banner */}
      <section className="bg-[#0058bc] text-white p-6 rounded-2xl overflow-hidden relative shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 space-y-3 text-center md:text-left">
            <h3 className="text-2xl font-bold tracking-tight">Need a custom itinerary?</h3>
            <p className="text-white/85 text-base leading-relaxed">
              Our AI Concierge can build a minute-by-minute plan based on your interests and budget in seconds.
            </p>
            <button
              onClick={onStartChat}
              className="mt-2 px-6 py-2.5 bg-white text-[#0058bc] font-bold rounded-full hover:bg-white/95 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              Start Chatting
            </button>
          </div>
          <div className="w-28 h-28 flex-none bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
            <span
              className="material-symbols-outlined text-white text-5xl"
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}
            >
              smart_toy
            </span>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </section>
    </div>
  );
};

