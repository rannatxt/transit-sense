import { Router } from 'express';

const router = Router();

// Indian License Plate Regex: e.g. MH12AB1234 or KA-05-MQ-8821
const INDIAN_PLATE_REGEX = /^[A-Z]{2}[ -]?[0-9]{2}[ -]?[A-Z]{1,3}[ -]?[0-9]{4}$/i;

// Sanitize inputs to prevent CSV injection / formula injection and XSS
function sanitizeForCsv(str) {
  if (typeof str !== 'string') return '';
  // Prevent CSV Injection formulas (=, +, -, @)
  let clean = str.replace(/^[=+\-@\t\r]+/, '');
  // Sanitize HTML / Script tags
  clean = clean.replace(/[<>'"&]/g, '');
  return clean.trim();
}

// GET /api/export/csv
router.get('/csv', (req, res) => {
  const hubId = sanitizeForCsv(req.query.hub || 'all');
  const plateFilter = req.query.plate ? req.query.plate.trim() : null;

  if (plateFilter && !INDIAN_PLATE_REGEX.test(plateFilter)) {
    return res.status(400).json({ error: 'Invalid Indian vehicle license plate format.' });
  }

  const now = new Date().toISOString();
  let csvContent = 'Timestamp_IST,Hub_ID,City,Vehicle_Plate,Class,Speed_KMH,Violation,Fine_INR\n';

  csvContent += `${now},mum,Mumbai,MH-14-BT-1092,Two-Wheeler,38,Triple Riding Violation,1000\n`;
  csvContent += `${now},blr,Bangalore,KA-05-MQ-8821,Auto-Rickshaw,14,Stop-Line Encroachment,500\n`;
  csvContent += `${now},del,Delhi NCR,DL-1C-AA-9901,Car,86,Dangerous Speeding,2000\n`;
  csvContent += `${now},hyd,Hyderabad,TS-08-FG-4481,Two-Wheeler,44,No Helmet Detected,1000\n`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="transitsense_log_${Date.now()}.csv"`);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.send(csvContent);
});

// GET /api/export/geojson
router.get('/geojson', (req, res) => {
  const geojson = {
    type: 'FeatureCollection',
    metadata: {
      platform: 'TRANSIT SENSE AI',
      standard: 'RFC 7946',
      timestamp: new Date().toISOString()
    },
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [72.8697, 19.1136] },
        properties: { hub: 'mum', name: 'Mumbai WEH', lci_score: 81, status: 'HEAVY' }
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [77.6227, 12.9172] },
        properties: { hub: 'blr', name: 'Bangalore Silk Board', lci_score: 88, status: 'CRITICAL' }
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [77.2944, 28.5833] },
        properties: { hub: 'del', name: 'Delhi NCR DND', lci_score: 42, status: 'OPTIMAL' }
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [78.3808, 17.4504] },
        properties: { hub: 'hyd', name: 'Hyderabad Cyber Towers', lci_score: 56, status: 'MODERATE' }
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [80.2033, 13.0067] },
        properties: { hub: 'chn', name: 'Chennai Kathipara', lci_score: 76, status: 'HEAVY' }
      }
    ]
  };

  res.setHeader('Content-Type', 'application/geo+json');
  res.setHeader('Content-Disposition', `attachment; filename="transitsense_spatial_${Date.now()}.geojson"`);
  res.json(geojson);
});

export default router;
