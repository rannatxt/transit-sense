import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Chart from 'chart.js/auto';

/* ===================================================================
   TRANSIT SENSE AI - APPLICATION LOGIC & NEURAL ENGINE
   =================================================================== */

// 1. DATA: 11 INDIAN METROPOLITAN HUBS & CORRIDORS
const CITIES_DATA = [
  {
    id: 'blr',
    name: 'Bangalore',
    junction: 'Silk Board Junction Flyover',
    region: 'south',
    coords: [12.9172, 77.6227],
    camId: 'CAM-BLR-04',
    rtsp: 'rtsp://iccc-node4.blr-traffic.gov.in:554/live/stream1',
    status: 'critical',
    statusText: 'CRITICAL (LCI: 88%)',
    speedLimit: '50 km/h (Peak 40)',
    cameras: 18,
    counts: { auto: 342, bike: 712, car: 538, heavy: 214, pedestrian: 78 },
    video: 'highway',
    lci: [78, 54, 89, 62],
    avgSpeed: 34.2
  },
  {
    id: 'mum',
    name: 'Mumbai',
    junction: 'Western Express Highway (WEH) Andheri',
    region: 'west',
    coords: [19.1136, 72.8697],
    camId: 'CAM-MUM-08',
    rtsp: 'rtsp://mum-weh-cam08.traffic.gov.in:554/feed',
    status: 'heavy',
    statusText: 'HEAVY (LCI: 81%)',
    speedLimit: '70 km/h (Flyover)',
    cameras: 24,
    counts: { auto: 295, bike: 640, car: 820, heavy: 185, pedestrian: 42 },
    video: 'urban',
    lci: [82, 60, 84, 58],
    avgSpeed: 41.5
  },
  {
    id: 'del',
    name: 'Delhi NCR',
    junction: 'DND Flyway Toll Plaza Intercept',
    region: 'north',
    coords: [28.5833, 77.2944],
    camId: 'CAM-DEL-02',
    rtsp: 'rtsp://delhi-dnd-toll.itms.nic.in:554/feed1',
    status: 'optimal',
    statusText: 'OPTIMAL (LCI: 42%)',
    speedLimit: '70 km/h (Toll Corridor)',
    cameras: 16,
    counts: { auto: 130, bike: 490, car: 960, heavy: 330, pedestrian: 22 },
    video: 'highway',
    lci: [44, 38, 52, 35],
    avgSpeed: 58.4
  },
  {
    id: 'hyd',
    name: 'Hyderabad',
    junction: 'Cyber Towers Junction HITEC City',
    region: 'south',
    coords: [17.4504, 78.3808],
    camId: 'CAM-HYD-12',
    rtsp: 'rtsp://hyd-cyber-cam12.ts-traffic.gov.in:554/main',
    status: 'moderate',
    statusText: 'MODERATE (LCI: 56%)',
    speedLimit: '50 km/h',
    cameras: 20,
    counts: { auto: 245, bike: 595, car: 628, heavy: 135, pedestrian: 56 },
    video: 'simulation',
    lci: [58, 48, 64, 52],
    avgSpeed: 44.1
  },
  {
    id: 'chn',
    name: 'Chennai',
    junction: 'Kathipara Cloverleaf Junction',
    region: 'south',
    coords: [13.0067, 80.2033],
    camId: 'CAM-CHN-01',
    rtsp: 'rtsp://chn-kathipara-01.tn-police.gov.in:554/live',
    status: 'heavy',
    statusText: 'HEAVY (LCI: 76%)',
    speedLimit: '60 km/h (Cloverleaf)',
    cameras: 22,
    counts: { auto: 318, bike: 685, car: 512, heavy: 242, pedestrian: 64 },
    video: 'highway',
    lci: [74, 62, 80, 59],
    avgSpeed: 38.6
  },
  {
    id: 'kol',
    name: 'Kolkata',
    junction: 'EM Bypass Science City Crossing',
    region: 'east',
    coords: [22.5398, 88.3973],
    camId: 'CAM-KOL-06',
    rtsp: 'rtsp://kol-embypass-sc.wb-traffic.gov.in:554/stream',
    status: 'moderate',
    statusText: 'MODERATE (LCI: 64%)',
    speedLimit: '50 km/h',
    cameras: 15,
    counts: { auto: 395, bike: 515, car: 485, heavy: 175, pedestrian: 92 },
    video: 'urban',
    lci: [62, 54, 72, 68],
    avgSpeed: 35.8
  },
  {
    id: 'pun',
    name: 'Pune',
    junction: 'Hinjewadi Phase 1 Overpass',
    region: 'west',
    coords: [18.5913, 73.7389],
    camId: 'CAM-PUN-03',
    rtsp: 'rtsp://pune-hinjewadi-cam3.smartcity.gov.in:554/live',
    status: 'critical',
    statusText: 'CRITICAL (LCI: 86%)',
    speedLimit: '50 km/h',
    cameras: 14,
    counts: { auto: 215, bike: 830, car: 495, heavy: 115, pedestrian: 44 },
    video: 'highway',
    lci: [84, 76, 88, 70],
    avgSpeed: 31.9
  },
  {
    id: 'amd',
    name: 'Ahmedabad',
    junction: 'SG Highway Iskcon Crossroad',
    region: 'west',
    coords: [23.0284, 72.5068],
    camId: 'CAM-AMD-05',
    rtsp: 'rtsp://amd-sghighway-isk.guj-itms.gov.in:554/cam',
    status: 'optimal',
    statusText: 'OPTIMAL (LCI: 38%)',
    speedLimit: '60 km/h',
    cameras: 18,
    counts: { auto: 265, bike: 545, car: 585, heavy: 165, pedestrian: 32 },
    video: 'urban',
    lci: [40, 32, 45, 34],
    avgSpeed: 52.3
  },
  {
    id: 'koc',
    name: 'Kochi',
    junction: 'Edappally Junction Bypass',
    region: 'south',
    coords: [10.0261, 76.3125],
    camId: 'CAM-KOC-02',
    rtsp: 'rtsp://kochi-edappally.kerala-traffic.gov.in:554/live',
    status: 'moderate',
    statusText: 'MODERATE (LCI: 62%)',
    speedLimit: '50 km/h',
    cameras: 12,
    counts: { auto: 295, bike: 495, car: 425, heavy: 155, pedestrian: 68 },
    video: 'simulation',
    lci: [60, 52, 68, 55],
    avgSpeed: 39.4
  },
  {
    id: 'jai',
    name: 'Jaipur',
    junction: 'MI Road / Ajmeri Gate Circle',
    region: 'north',
    coords: [26.9167, 75.8167],
    camId: 'CAM-JAI-07',
    rtsp: 'rtsp://jpr-miroad-iccc.rajasthan.gov.in:554/stream',
    status: 'moderate',
    statusText: 'MODERATE (LCI: 59%)',
    speedLimit: '40 km/h',
    cameras: 10,
    counts: { auto: 355, bike: 615, car: 395, heavy: 98, pedestrian: 112 },
    video: 'urban',
    lci: [56, 48, 62, 58],
    avgSpeed: 32.7
  },
  {
    id: 'lko',
    name: 'Lucknow',
    junction: 'Hazratganj Multi-way Intersection',
    region: 'north',
    coords: [26.8500, 80.9500],
    camId: 'CAM-LKO-09',
    rtsp: 'rtsp://lko-hazratganj.up-itms.gov.in:554/main',
    status: 'heavy',
    statusText: 'HEAVY (LCI: 78%)',
    speedLimit: '40 km/h',
    cameras: 14,
    counts: { auto: 335, bike: 675, car: 465, heavy: 128, pedestrian: 88 },
    video: 'highway',
    lci: [76, 68, 82, 70],
    avgSpeed: 33.5
  }
];

// STATE MANAGEMENT
let activeCity = CITIES_DATA[0];
let isNeuralActive = true;
let isSimulationMode = false;
let confidenceThreshold = 0.70;
let tripwireCrossCount = 0;
let tripwireFlash = 0;

// Leaflet Map & Chart Instances
let leafletMap = null;
let cityMarkers = [];
let donutChart = null;
let throughputChart = null;

// VIOLATIONS RECORD
const VIOLATIONS_LOG = [
  {
    id: 'VIO-BLR-1092',
    type: 'Helmet Non-Compliance',
    vehicle: 'Two-Wheeler (Honda Activa)',
    plate: 'KA-05-MQ-8821',
    confidence: 0.974,
    speed: '44 km/h',
    time: 'Just now',
    severity: 'crimson',
    section: 'MV Act 2019 Sec 194D (Riding without standard helmet)',
    desc: 'Rider and pillion detected without safety helmet while crossing intersection.',
    fine: '₹1,000'
  },
  {
    id: 'VIO-MUM-4401',
    type: 'Wrong-Way Driving',
    vehicle: 'Heavy Bus (Private Charter)',
    plate: 'MH-02-CP-8041',
    confidence: 0.982,
    speed: '32 km/h',
    time: '2 mins ago',
    severity: 'crimson',
    section: 'MV Act 2019 Sec 184 (Dangerous driving opposing traffic stream)',
    desc: 'Commercial passenger vehicle entered one-way express service lane in reverse heading.',
    fine: '₹5,000'
  },
  {
    id: 'VIO-DEL-8923',
    type: 'Dangerous Corridor Speeding',
    vehicle: 'Car (Hyundai Creta White)',
    plate: 'DL-1C-AA-9901',
    confidence: 0.988,
    speed: '86 km/h (Limit: 50)',
    time: '4 mins ago',
    severity: 'crimson',
    section: 'MV Act 2019 Sec 183 (Excessive speeding beyond corridor cap)',
    desc: 'High speed tracking radar recorded 86 km/h in 50 km/h signal approach corridor.',
    fine: '₹2,000'
  },
  {
    id: 'VIO-PUN-3312',
    type: 'Triple Riding Violation',
    vehicle: 'Two-Wheeler (Bajaj Pulsar)',
    plate: 'MH-12-FK-4299',
    confidence: 0.956,
    speed: '38 km/h',
    time: '7 mins ago',
    severity: 'gold',
    section: 'MV Act 2019 Sec 194C (More than two persons on motorcycle)',
    desc: 'Three passengers detected on two-wheeler entering IT park flyover ramp.',
    fine: '₹1,000'
  },
  {
    id: 'VIO-CHN-7721',
    type: 'Stop-Line Zebra Encroachment',
    vehicle: 'Auto-Rickshaw (Bajaj RE)',
    plate: 'TN-09-CB-3184',
    confidence: 0.932,
    speed: '12 km/h',
    time: '9 mins ago',
    severity: 'gold',
    section: 'MV Act 2019 Sec 177 (Disobedience of traffic signal stop lines)',
    desc: 'Auto-rickshaw encroached active pedestrian crosswalk during red signal cycle.',
    fine: '₹500'
  }
];

// PIPELINE NODES SPECS
const PIPELINE_SPECS = {
  rtsp: {
    title: 'Stage 1: RTSP / IP Camera Sources',
    desc: 'Ingests high-bitrate live video streams from optical & PTZ traffic cameras over RTSP/ONVIF protocols with sub-millisecond network buffering.',
    metrics: [
      { label: 'Protocols', val: 'RTSP / ONVIF Profile S' },
      { label: 'Ingestion Resolution', val: '1920x1080 @ 60 FPS' },
      { label: 'Bandwidth', val: '4.8 Mbps per camera stream' },
      { label: 'Active Camera Streams', val: '184 corridor channels' }
    ]
  },
  ffmpeg: {
    title: 'Stage 2: FFmpeg Hardware Ingestion (NVDEC)',
    desc: 'Hardware accelerated H.264/H.265 stream decoding directly in NVIDIA GPU memory via NVDEC/VAAPI, eliminating host CPU-GPU bus bottlenecks.',
    metrics: [
      { label: 'Hardware Acceleration', val: 'NVIDIA NVDEC (Turing/Ampere/Ada)' },
      { label: 'Color Format', val: 'YUV420p ➔ RGB FP16 Plane' },
      { label: 'Demux Latency', val: '1.4 ms per frame' },
      { label: 'Host CPU Overhead', val: '< 2.5% utilization' }
    ]
  },
  yolo: {
    title: 'Stage 3: NVIDIA TensorRT YOLOv11 Multi-Scale Detector',
    desc: 'Optimized YOLOv11 deep neural network compiled to TensorRT FP16 engine, executing heterogeneous multi-class detection tuned for Indian traffic characteristics.',
    metrics: [
      { label: 'Model Architecture', val: 'YOLOv11x-Traffic (Custom Indian Weights)' },
      { label: 'Inference Engine', val: 'NVIDIA TensorRT 10.2 (FP16 Engine)' },
      { label: 'Forward Pass Latency', val: '11.4 ms (at 640x640)' },
      { label: 'Trained Classes', val: 'Auto, Two-Wheeler, Car, Bus/Truck, Pedestrian' }
    ]
  },
  bytetrack: {
    title: 'Stage 4: ByteTrack Multi-Object Tracker (MOT)',
    desc: 'High-performance real-time tracking algorithm associating both high and low score detection boxes via Kalman filtering and Hungarian bipartite matching.',
    metrics: [
      { label: 'Association Algorithm', val: 'Kalman Filter + Hungarian Matching' },
      { label: 'Tracking Speed', val: '> 120 FPS on Edge GPU' },
      { label: 'ID Switch Rate', val: '< 0.08% per 1,000 frames' },
      { label: 'Trajectory Memory', val: '30-frame spatial vector history' }
    ]
  },
  mqtt: {
    title: 'Stage 5: MQTT / Kafka Telemetry Event Broker',
    desc: 'Distributed pub/sub messaging broker publishing vehicle counts, velocity vectors, lane occupancy, and rule violation packets with guaranteed delivery.',
    metrics: [
      { label: 'Broker Stack', val: 'Apache Kafka 3.7 + Mosquitto MQTT' },
      { label: 'Message Throughput', val: '15,000 msgs/second' },
      { label: 'Payload Format', val: 'Compact Protocol Buffers (Protobuf) / JSON' },
      { label: 'QoS Level', val: 'QoS 1 (At least once delivery)' }
    ]
  },
  ws: {
    title: 'Stage 6: WebSocket Edge Gateway & Reactive Dashboard',
    desc: 'Sub-50ms duplex streaming gateway pushing real-time bounding boxes, live counters, and e-challan notices directly to the operator interface.',
    metrics: [
      { label: 'Connection', val: 'Secure WebSockets (WSS) Edge Gateway' },
      { label: 'Client Latency', val: '< 16 ms browser render' },
      { label: 'Client Encryption', val: 'TLS 1.3 / AES-256-GCM' },
      { label: 'ICCC Integration', val: 'MoRTH Vahan & Sarathi API Compatible' }
    ]
  }
};

/* ===================================================================
   SIMULATED NEURAL TRACKING & BOUNDING BOX GENERATOR
   =================================================================== */

// Vehicle classes configured with specific Indian traffic colors and attributes
const VEHICLE_CLASSES = [
  { name: 'Auto-Rickshaw', code: 'AR', color: '#D4AF37', icon: '🛺', w: 48, h: 36, speedBase: 32 },
  { name: 'Two-Wheeler', code: '2W', color: '#0284C7', icon: '🛵', w: 32, h: 26, speedBase: 44 },
  { name: 'Car', code: 'CR', color: '#10B981', icon: '🚗', w: 58, h: 42, speedBase: 52 },
  { name: 'Heavy Bus', code: 'HV', color: '#990000', icon: '🚌', w: 84, h: 54, speedBase: 28 },
  { name: 'Pedestrian', code: 'PD', color: '#8B5CF6', icon: '🚶', w: 20, h: 30, speedBase: 4 }
];

// Active tracked objects on canvas
let trackedVehicles = [];
let nextTrackId = 1040;

// Initialize tracked objects
function initTrackedVehicles(canvasWidth, canvasHeight) {
  trackedVehicles = [];
  const count = 9;
  for (let i = 0; i < count; i++) {
    spawnVehicle(canvasWidth, canvasHeight, true);
  }
}

// Spawn single vehicle with perspective-aware lane trajectories
function spawnVehicle(width, height, randomY = false) {
  // Weighted class distribution typical for Indian traffic
  const rand = Math.random();
  let vClass;
  if (rand < 0.22) vClass = VEHICLE_CLASSES[0];      // 22% Auto-rickshaws
  else if (rand < 0.58) vClass = VEHICLE_CLASSES[1]; // 36% Two-wheelers
  else if (rand < 0.85) vClass = VEHICLE_CLASSES[2]; // 27% Cars
  else if (rand < 0.95) vClass = VEHICLE_CLASSES[3]; // 10% Heavy buses
  else vClass = VEHICLE_CLASSES[4];                  // 5% Pedestrians

  // Direction: mostly downward (inbound) or upward (outbound)
  const isDown = Math.random() > 0.35;
  const laneIndex = Math.floor(Math.random() * 4); // Lanes 0, 1, 2, 3
  const laneX = (width * 0.15) + (laneIndex * (width * 0.70 / 4)) + (Math.random() * 40 - 20);

  const startY = randomY ? Math.random() * (height - 80) + 40 : (isDown ? -60 : height + 60);
  const speed = (vClass.speedBase * (0.8 + Math.random() * 0.4)) * 0.08;

  const vehicle = {
    id: `${vClass.code}-${nextTrackId++}`,
    vClass: vClass,
    x: laneX,
    y: startY,
    width: vClass.w * (0.85 + Math.random() * 0.3),
    height: vClass.h * (0.85 + Math.random() * 0.3),
    speedKmh: Math.round(vClass.speedBase * (0.85 + Math.random() * 0.3)),
    confidence: (0.91 + Math.random() * 0.08).toFixed(2),
    lane: `Lane ${laneIndex + 1}`,
    vy: isDown ? speed : -speed,
    vx: (Math.random() - 0.5) * 0.2,
    trail: [],
    crossedTripwire: false,
    isDown: isDown
  };

  trackedVehicles.push(vehicle);
}

// Canvas & Video Loop
function startNeuralEngine() {
  const canvas = document.getElementById('neuralCanvas');
  const video = document.getElementById('trafficVideo');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    if (canvas && video) {
      canvas.width = video.clientWidth || 960;
      canvas.height = video.clientHeight || 540;
    }
  }

  window.addEventListener('resize', resizeCanvas);
  video.addEventListener('loadedmetadata', resizeCanvas);
  resizeCanvas();

  initTrackedVehicles(canvas.width || 960, canvas.height || 540);

  function renderFrame() {
    if (!canvas || !ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // If simulation mode active, draw authentic Indian road backdrop & vehicles
    if (isSimulationMode) {
      renderProceduralIndianCorridor(ctx, w, h);
    }

    // Only render Neural Vision detection overlay if toggled ON
    if (isNeuralActive) {
      const showBoxes = document.getElementById('chkBoundingBoxes')?.checked ?? true;
      const showVectors = document.getElementById('chkVectors')?.checked ?? true;
      const showTripwire = document.getElementById('chkTripwire')?.checked ?? true;
      const showLabels = document.getElementById('chkLabels')?.checked ?? true;

      const tripwireY = h * 0.52;

      // 1. Render Virtual Tripwire Cordon Line
      if (showTripwire) {
        ctx.save();
        ctx.lineWidth = tripwireFlash > 0 ? 4 : 2;
        ctx.strokeStyle = tripwireFlash > 0 ? '#D4AF37' : 'rgba(212, 175, 55, 0.75)';
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(w * 0.05, tripwireY);
        ctx.lineTo(w * 0.95, tripwireY);
        ctx.stroke();

        // Tripwire Labels
        ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.fillStyle = tripwireFlash > 0 ? '#FFFFFF' : '#D4AF37';
        ctx.fillText('⚡ VIRTUAL CORDON LINE-A [INBOUND COUNT]', w * 0.06, tripwireY - 8);
        ctx.fillText(`COUNTED: ${tripwireCrossCount} VEHICLES`, w * 0.72, tripwireY - 8);
        ctx.restore();

        if (tripwireFlash > 0) tripwireFlash--;
      }

      // 2. Update and Render Tracked Vehicles
      for (let i = trackedVehicles.length - 1; i >= 0; i--) {
        const v = trackedVehicles[i];

        // Update position
        v.y += v.vy;
        v.x += v.vx;

        // Record trajectory trail points
        v.trail.push({ x: v.x + v.width / 2, y: v.y + v.height / 2 });
        if (v.trail.length > 14) v.trail.shift();

        // Tripwire collision detection
        const centerY = v.y + v.height / 2;
        if (!v.crossedTripwire) {
          if ((v.vy > 0 && centerY >= tripwireY) || (v.vy < 0 && centerY <= tripwireY)) {
            v.crossedTripwire = true;
            onVehicleCrossTripwire(v);
          }
        }

        // Draw Motion Vectors Trail
        if (showVectors && v.trail.length > 2) {
          ctx.save();
          ctx.strokeStyle = v.vClass.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let t = 0; t < v.trail.length; t++) {
            const pt = v.trail[t];
            if (t === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
          ctx.stroke();

          // Heading directional arrow
          const head = v.trail[v.trail.length - 1];
          ctx.fillStyle = v.vClass.color;
          ctx.beginPath();
          ctx.arc(head.x, head.y, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Filter by Confidence Slider
        if (parseFloat(v.confidence) >= confidenceThreshold) {
          // Draw High-Tech YOLOv11 Bounding Box
          if (showBoxes) {
            ctx.save();
            ctx.strokeStyle = v.vClass.color;
            ctx.lineWidth = 2;
            ctx.strokeRect(v.x, v.y, v.width, v.height);

            // Corner brackets styling (military/AI grade aesthetic)
            const bLen = Math.min(10, v.width * 0.25);
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2.5;

            // Top-left
            ctx.beginPath();
            ctx.moveTo(v.x, v.y + bLen);
            ctx.lineTo(v.x, v.y);
            ctx.lineTo(v.x + bLen, v.y);
            ctx.stroke();

            // Top-right
            ctx.beginPath();
            ctx.moveTo(v.x + v.width - bLen, v.y);
            ctx.lineTo(v.x + v.width, v.y);
            ctx.lineTo(v.x + v.width, v.y + bLen);
            ctx.stroke();

            // Bottom-left
            ctx.beginPath();
            ctx.moveTo(v.x, v.y + v.height - bLen);
            ctx.lineTo(v.x, v.y + v.height);
            ctx.lineTo(v.x + bLen, v.y + v.height);
            ctx.stroke();

            // Bottom-right
            ctx.beginPath();
            ctx.moveTo(v.x + v.width - bLen, v.y + v.height);
            ctx.lineTo(v.x + v.width, v.y + v.height);
            ctx.lineTo(v.x + v.width, v.y + v.height - bLen);
            ctx.stroke();

            ctx.restore();
          }

          // Draw Bounding Box Labels (Class Name, ByteTrack ID, Confidence, Speed)
          if (showLabels) {
            ctx.save();
            const labelText = `#${v.id} ${v.vClass.name} [${v.confidence}] ${v.speedKmh} km/h`;
            ctx.font = '700 10.5px "JetBrains Mono", monospace';
            const metrics = ctx.measureText(labelText);
            const labelWidth = metrics.width + 12;
            const labelHeight = 18;

            // Label background badge
            ctx.fillStyle = v.vClass.color;
            ctx.fillRect(v.x, v.y - labelHeight, labelWidth, labelHeight);

            // Label text
            ctx.fillStyle = (v.vClass.name === 'Auto-Rickshaw' || v.vClass.name === 'Two-Wheeler') ? '#000000' : '#FFFFFF';
            ctx.fillText(labelText, v.x + 6, v.y - 5);
            ctx.restore();
          }
        }

        // Despawn when out of view and respawn
        if (v.y > h + 80 || v.y < -80) {
          trackedVehicles.splice(i, 1);
          spawnVehicle(w, h, false);
        }
      }
    }

    requestAnimationFrame(renderFrame);
  }

  requestAnimationFrame(renderFrame);
}

// Procedural Indian Corridor Canvas (renders authentic multi-class Indian traffic)
function renderProceduralIndianCorridor(ctx, w, h) {
  // Road asphalt surface
  ctx.fillStyle = '#262626';
  ctx.fillRect(0, 0, w, h);

  // Road lane markings
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 3;
  ctx.setLineDash([20, 20]);

  // 4 Lanes dividers
  for (let l = 1; l <= 3; l++) {
    const x = w * (l / 4);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Road Yellow Curbs / Kerbs
  ctx.fillStyle = '#D4AF37';
  ctx.fillRect(0, 0, 8, h);
  ctx.fillRect(w - 8, 0, 8, h);

  // Pedestrian Zebra Crossing
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  for (let z = 15; z < w - 20; z += 35) {
    ctx.fillRect(z, h * 0.48, 20, 40);
  }
}

// Vehicle Crossed Tripwire Handler: Increments class counts & updates charts
function onVehicleCrossTripwire(vehicle) {
  tripwireCrossCount++;
  tripwireFlash = 12;

  // Update active city counts
  const cName = vehicle.vClass.name;
  if (cName === 'Auto-Rickshaw') activeCity.counts.auto++;
  else if (cName === 'Two-Wheeler') activeCity.counts.bike++;
  else if (cName === 'Car') activeCity.counts.car++;
  else if (cName === 'Heavy Bus') activeCity.counts.heavy++;
  else if (cName === 'Pedestrian') activeCity.counts.pedestrian++;

  // Update UI Counters with flash effect
  updateCountersUI();

  // Update Chart.js Donut chart
  if (donutChart) {
    donutChart.data.datasets[0].data = [
      activeCity.counts.auto,
      activeCity.counts.bike,
      activeCity.counts.car,
      activeCity.counts.heavy,
      activeCity.counts.pedestrian
    ];
    donutChart.update('none');
  }

  // Flash HUD status
  const hudStatus = document.getElementById('hudTripwireStatus');
  if (hudStatus) {
    hudStatus.innerHTML = `VIRTUAL TRIPWIRE TRIGGER: <span style="color: #10B981;">+1 ${vehicle.vClass.name.toUpperCase()} (#${vehicle.id})</span>`;
    setTimeout(() => {
      hudStatus.innerHTML = `VIRTUAL TRIPWIRE CORDON: <span>LINE-A ACTIVE [IN/OUT]</span>`;
    }, 1800);
  }
}

// Update all UI counter numbers and percentages
function updateCountersUI() {
  const counts = activeCity.counts;
  const total = counts.auto + counts.bike + counts.car + counts.heavy + counts.pedestrian;

  const totalElem = document.getElementById('totalVehicleCount');
  if (totalElem) totalElem.textContent = total.toLocaleString();

  // Values
  document.getElementById('countAuto').textContent = counts.auto.toLocaleString();
  document.getElementById('countBike').textContent = counts.bike.toLocaleString();
  document.getElementById('countCar').textContent = counts.car.toLocaleString();
  document.getElementById('countHeavy').textContent = counts.heavy.toLocaleString();
  document.getElementById('countPedestrian').textContent = counts.pedestrian.toLocaleString();

  // Percentage Shares
  const pct = (val) => Math.round((val / total) * 100) + '%';
  document.getElementById('shareAuto').textContent = pct(counts.auto);
  document.getElementById('shareBike').textContent = pct(counts.bike);
  document.getElementById('shareCar').textContent = pct(counts.car);
  document.getElementById('shareHeavy').textContent = pct(counts.heavy);
  document.getElementById('sharePedestrian').textContent = pct(counts.pedestrian);
}

/* ===================================================================
   INTERACTIVE INDIAN MAP HUB (LEAFLET.JS)
   =================================================================== */

function initIndianMapHub() {
  const mapContainer = document.getElementById('indiaMap');
  if (!mapContainer) return;

  // Initialize Leaflet Map centered on central India
  leafletMap = L.map('indiaMap', {
    center: [21.0, 78.9],
    zoom: 5,
    zoomControl: true,
    minZoom: 4,
    maxZoom: 16
  });

  // Clean, crisp light CartoDB Positron basemap tiles
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(leafletMap);

  // Add Custom Pulsing Node Markers for all 11 Cities
  cityMarkers = [];
  CITIES_DATA.forEach(city => {
    // Custom HTML Marker with radar pulse wave
    const isCritical = city.status === 'critical';
    const markerHtml = `
      <div class="custom-node-marker" title="${city.name} - ${city.junction}">
        <div class="marker-radar-ring ${isCritical ? '' : 'gold-ring'}"></div>
        <div class="marker-inner" style="background: ${isCritical ? '#990000' : '#1A1A1A'}; border-color: #D4AF37;">
          ${city.id.toUpperCase().substring(0, 2)}
        </div>
      </div>
    `;

    const icon = L.divIcon({
      className: 'custom-leaflet-div-icon',
      html: markerHtml,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const marker = L.marker(city.coords, { icon: icon }).addTo(leafletMap);

    // Popup with live corridor telemetry
    const popupContent = `
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px; min-width: 190px;">
        <div style="font-size: 13px; font-weight: 800; color: #990000;">${city.name} Corridor</div>
        <div style="font-size: 11px; font-weight: 600; color: #4A5568;">${city.junction}</div>
        <div style="margin: 6px 0; padding: 4px 6px; background: #F8FAFC; border-left: 3px solid #D4AF37; font-family: 'JetBrains Mono', monospace; font-size: 11px;">
          CAM: <strong>${city.camId}</strong><br/>
          STATUS: <span style="color: ${isCritical ? '#990000' : '#B8860B'}; font-weight: 700;">${city.statusText}</span><br/>
          SPEED LIMIT: <strong>${city.speedLimit}</strong>
        </div>
        <button id="btnSwitchFromMap_${city.id}" style="width: 100%; padding: 5px; background: #990000; color: #FFF; border: none; border-radius: 4px; font-size: 11px; font-weight: 700; cursor: pointer;">
          Switch Camera Feed & Telemetry
        </button>
      </div>
    `;

    marker.bindPopup(popupContent);

    marker.on('popupopen', () => {
      const btn = document.getElementById(`btnSwitchFromMap_${city.id}`);
      if (btn) {
        btn.addEventListener('click', () => {
          selectCity(city.id);
          leafletMap.closePopup();
        });
      }
    });

    marker.on('click', () => {
      selectCity(city.id);
    });

    cityMarkers.push({ city, marker });
  });

  // Map Filter Buttons
  const filterBtns = document.querySelectorAll('.map-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const region = btn.getAttribute('data-filter');

      if (region === 'all') {
        cityMarkers.forEach(m => m.marker.addTo(leafletMap));
        leafletMap.flyTo([21.0, 78.9], 5, { duration: 1.2 });
      } else {
        const filtered = cityMarkers.filter(m => m.city.region === region);
        cityMarkers.forEach(m => {
          if (m.city.region === region) m.marker.addTo(leafletMap);
          else leafletMap.removeLayer(m.marker);
        });
        if (filtered.length > 0) {
          const group = L.featureGroup(filtered.map(m => m.marker));
          leafletMap.fitBounds(group.getBounds().pad(0.3));
        }
      }
    });
  });

  // Recenter Button
  document.getElementById('btnRecenterMap')?.addEventListener('click', () => {
    leafletMap.flyTo([21.0, 78.9], 5, { duration: 1.2 });
  });
}

// Select and Switch Active City
function selectCity(cityId) {
  const city = CITIES_DATA.find(c => c.id === cityId);
  if (!city) return;
  activeCity = city;

  // 1. Update City Pill Strip
  document.querySelectorAll('.city-pill').forEach(pill => {
    if (pill.getAttribute('data-city') === cityId) pill.classList.add('active');
    else pill.classList.remove('active');
  });

  // 2. Pan Map to City Coordinates
  if (leafletMap) {
    leafletMap.flyTo(city.coords, 13, { duration: 1.2 });
  }

  // 3. Update Camera Meta Bar
  document.getElementById('cameraBadge').textContent = city.camId;
  document.getElementById('cameraLocationText').textContent = `${city.name} - ${city.junction}`;
  document.getElementById('cameraRtspText').textContent = city.rtsp;

  // 4. Update Video Source accordingly
  const videoElem = document.getElementById('trafficVideo');
  const sourceSelect = document.getElementById('videoSourceSelect');
  if (city.video === 'simulation') {
    isSimulationMode = true;
    if (videoElem) videoElem.style.display = 'none';
    if (sourceSelect) sourceSelect.value = 'simulation';
  } else if (city.video === 'urban') {
    isSimulationMode = false;
    if (videoElem) {
      videoElem.style.display = 'block';
      videoElem.src = '/videos/traffic_urban.mp4';
      videoElem.play().catch(() => {});
    }
    if (sourceSelect) sourceSelect.value = 'urban';
  } else {
    isSimulationMode = false;
    if (videoElem) {
      videoElem.style.display = 'block';
      videoElem.src = '/videos/traffic_highway.mp4';
      videoElem.play().catch(() => {});
    }
    if (sourceSelect) sourceSelect.value = 'highway';
  }

  // 5. Update Map Telemetry Bar
  document.getElementById('mapNodeName').textContent = `${city.name} ${city.junction}`;
  document.getElementById('mapNodeCoords').textContent = `${city.coords[0].toFixed(4)}° N, ${city.coords[1].toFixed(4)}° E`;
  document.getElementById('mapNodeSpeedLimit').textContent = city.speedLimit;
  document.getElementById('mapNodeStatus').textContent = city.statusText;
  document.getElementById('mapNodeStatus').style.color = city.status === 'critical' ? 'var(--crimson-primary)' : 'var(--gold-dark)';

  // 6. Update Lane Congestion Index (LCI) Gauges
  updateLciGauges(city.lci, city.avgSpeed);

  // 7. Update Counters UI
  updateCountersUI();

  // 8. Update Donut Chart
  if (donutChart) {
    donutChart.data.datasets[0].data = [
      city.counts.auto,
      city.counts.bike,
      city.counts.car,
      city.counts.heavy,
      city.counts.pedestrian
    ];
    donutChart.update();
  }

  showToast(`Switched active hub to ${city.name} (${city.junction})`, 'gold');
}

// Update Lane Congestion Index (LCI) UI
function updateLciGauges(lci, avgSpeed) {
  const lanes = [
    { bar: 'l1Bar', density: 'l1Density', status: 'l1Status', speed: 'l1Speed', val: lci[0], spd: Math.round(avgSpeed * 1.35) },
    { bar: 'l2Bar', density: 'l2Density', status: 'l2Status', speed: 'l2Speed', val: lci[1], spd: Math.round(avgSpeed * 1.1) },
    { bar: 'l3Bar', density: 'l3Density', status: 'l3Status', speed: 'l3Speed', val: lci[2], spd: Math.round(avgSpeed * 0.75) },
    { bar: 'l4Bar', density: 'l4Density', status: 'l4Status', speed: 'l4Speed', val: lci[3], spd: Math.round(avgSpeed * 0.9) }
  ];

  lanes.forEach(l => {
    const barEl = document.getElementById(l.bar);
    const densityEl = document.getElementById(l.density);
    const statusEl = document.getElementById(l.status);
    const speedEl = document.getElementById(l.speed);

    if (barEl) {
      barEl.style.width = `${l.val}%`;
      barEl.className = 'lane-gauge-fill ' + (l.val >= 80 ? 'fill-critical' : l.val >= 60 ? 'fill-heavy' : l.val >= 40 ? 'fill-moderate' : 'fill-optimal');
    }
    if (densityEl) densityEl.textContent = `${l.val}% LCI`;
    if (speedEl) speedEl.textContent = `${l.spd} km/h`;
    if (statusEl) {
      const text = l.val >= 80 ? 'Critical' : l.val >= 60 ? 'Heavy' : l.val >= 40 ? 'Moderate' : 'Optimal';
      statusEl.textContent = text;
      statusEl.className = 'lane-status-text ' + (l.val >= 80 ? 'status-critical' : l.val >= 60 ? 'status-heavy' : l.val >= 40 ? 'status-moderate' : 'status-optimal');
    }
  });

  // Update Average Velocity
  document.getElementById('avgCorridorSpeed').innerHTML = `${avgSpeed.toFixed(1)} <small style="font-size: 0.75rem; font-weight: 500;">km/h</small>`;
}

/* ===================================================================
   CHARTS: CHART.JS DONUT BREAKDOWN & THROUGHPUT SPARKLINE
   =================================================================== */

function initAnalyticsCharts() {
  // 1. Vehicle Class Distribution Donut Chart
  const donutCanvas = document.getElementById('classDonutChart');
  if (donutCanvas) {
    donutChart = new Chart(donutCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Auto', 'Two-Wheeler', 'Car', 'Heavy', 'Pedestrian'],
        datasets: [{
          data: [
            activeCity.counts.auto,
            activeCity.counts.bike,
            activeCity.counts.car,
            activeCity.counts.heavy,
            activeCity.counts.pedestrian
          ],
          backgroundColor: [
            '#D4AF37', // Auto Gold
            '#0284C7', // Bike Cyan
            '#10B981', // Car Emerald
            '#990000', // Heavy Crimson
            '#8B5CF6'  // Pedestrian Violet
          ],
          borderWidth: 2,
          borderColor: '#FFFFFF',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 10,
              boxHeight: 10,
              font: { family: 'Plus Jakarta Sans', size: 10, weight: 600 },
              color: '#4A5568'
            }
          },
          tooltip: {
            callbacks: {
              label: (item) => ` ${item.label}: ${item.raw.toLocaleString()} vehicles`
            }
          }
        },
        cutout: '68%'
      }
    });
  }

  // 2. Throughput Flow Over Time Line Chart
  const throughputCanvas = document.getElementById('throughputChart');
  if (throughputCanvas) {
    const timeLabels = ['10:35', '10:37', '10:39', '10:41', '10:43', '10:45', '10:47', '10:49', '10:51', '10:53'];
    const throughputData = [118, 124, 132, 128, 140, 136, 144, 138, 148, 152];

    throughputChart = new Chart(throughputCanvas, {
      type: 'line',
      data: {
        labels: timeLabels,
        datasets: [{
          label: 'Throughput (veh/min)',
          data: throughputData,
          borderColor: '#990000',
          backgroundColor: 'rgba(153, 0, 0, 0.08)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointBackgroundColor: '#D4AF37',
          pointBorderColor: '#990000',
          pointRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (item) => ` Flow: ${item.raw} vehicles/min`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { family: 'JetBrains Mono', size: 9 }, color: '#94A3B8' }
          },
          y: {
            grid: { color: '#EDF2F7' },
            ticks: { font: { family: 'JetBrains Mono', size: 9 }, color: '#94A3B8' }
          }
        }
      }
    });
  }
}

/* ===================================================================
   LIVE RULE VIOLATIONS STREAM & SNAPSHOT E-CHALLAN MODAL
   =================================================================== */

function renderViolationsFeed() {
  const container = document.getElementById('violationsFeed');
  if (!container) return;

  container.innerHTML = '';
  VIOLATIONS_LOG.forEach((vio, index) => {
    const card = document.createElement('div');
    card.className = 'violation-card';
    card.innerHTML = `
      <div class="violation-main">
        <div class="violation-tag-row">
          <span class="violation-badge ${vio.severity === 'crimson' ? 'badge-crimson' : 'badge-gold'}">${vio.type}</span>
          <span class="violation-time">${vio.time}</span>
          <span style="font-size: 0.68rem; font-family: var(--font-mono); color: #0284C7; font-weight: 700;">${vio.plate}</span>
        </div>
        <div class="violation-title">${vio.vehicle}</div>
        <div class="violation-desc">${vio.desc}</div>
      </div>
      <div class="violation-action">
        <button class="btn btn-crimson-outline" style="padding: 0.35rem 0.65rem; font-size: 0.72rem;" onclick="window.inspectViolation(${index})">
          Inspect E-Challan
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Global inspect violation function
window.inspectViolation = function(index) {
  const vio = VIOLATIONS_LOG[index];
  if (!vio) return;

  const modal = document.getElementById('violationModal');
  document.getElementById('modalViolationTitle').textContent = `Violation Evidence #${vio.id}`;
  document.getElementById('echallanPlate').textContent = vio.plate;
  document.getElementById('echallanSection').textContent = vio.section;
  document.getElementById('echallanDescription').textContent = vio.desc;
  document.getElementById('echallanFine').textContent = vio.fine;
  document.getElementById('echallanTime').textContent = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';
  document.getElementById('echallanCam').textContent = activeCity.camId;
  document.getElementById('echallanBadge').textContent = `YOLOv11: ${vio.type.toUpperCase()} [${vio.confidence}]`;

  // Draw simulated snapshot frame onto the modal canvas
  drawViolationEvidenceSnapshot(vio);

  modal.classList.add('active');
};

function drawViolationEvidenceSnapshot(vio) {
  const canvas = document.getElementById('echallanSnapshotCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // Background road dark tone
  ctx.fillStyle = '#1E1E1E';
  ctx.fillRect(0, 0, w, h);

  // Road lanes perspective
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  ctx.setLineDash([12, 12]);
  ctx.beginPath();
  ctx.moveTo(w * 0.35, 0); ctx.lineTo(w * 0.2, h);
  ctx.moveTo(w * 0.65, 0); ctx.lineTo(w * 0.8, h);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw Vehicle Silhouette
  ctx.fillStyle = '#334155';
  ctx.fillRect(w * 0.35, h * 0.35, 150, 110);

  // Red Bounding Box around vehicle
  ctx.strokeStyle = '#EF4444';
  ctx.lineWidth = 3;
  ctx.strokeRect(w * 0.32, h * 0.28, 170, 130);

  // Corner marks
  ctx.fillStyle = '#EF4444';
  ctx.fillRect(w * 0.32, h * 0.28, 16, 4);
  ctx.fillRect(w * 0.32, h * 0.28, 4, 16);

  // License plate region highlight
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.strokeRect(w * 0.42, h * 0.58, 70, 22);

  ctx.fillStyle = '#D4AF37';
  ctx.font = '700 11px "JetBrains Mono", monospace';
  ctx.fillText(vio.plate, w * 0.43, h * 0.54);

  // Timestamp watermark
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 10px "JetBrains Mono", monospace';
  ctx.fillText(`TRANSIT SENSE AI OCR • ${activeCity.camId} • ${activeCity.junction}`, 14, h - 14);
}

// Push periodic new violations to simulate real-time live detection
function startViolationStreamSimulation() {
  const randomViolations = [
    { type: 'No Helmet Compliance', vehicle: 'Two-Wheeler (TVS Jupiter)', plate: 'KA-01-EQ-9102', fine: '₹1,000', section: 'MV Act Sec 194D', desc: 'Rider without helmet detected at signal junction.' },
    { type: 'Stop-Line Encroachment', vehicle: 'Auto-Rickshaw (Mahindra Alfa)', plate: 'DL-2C-TK-5532', fine: '₹500', section: 'MV Act Sec 177', desc: 'Auto stopped beyond designated stopline during red phase.' },
    { type: 'Triple Riding Detected', vehicle: 'Two-Wheeler (Hero Splendor)', plate: 'MH-14-BT-1092', fine: '₹1,000', section: 'MV Act Sec 194C', desc: '3 riders detected without helmets traveling at 42 km/h.' },
    { type: 'Corridor Over-Speeding', vehicle: 'Car (Honda City Silver)', plate: 'TS-08-FG-4481', fine: '₹2,000', section: 'MV Act Sec 183', desc: 'Clocked at 79 km/h in 50 km/h urban speed limit sector.' }
  ];

  setInterval(() => {
    const template = randomViolations[Math.floor(Math.random() * randomViolations.length)];
    const newVio = {
      id: `VIO-${activeCity.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      type: template.type,
      vehicle: template.vehicle,
      plate: template.plate,
      confidence: (0.93 + Math.random() * 0.06).toFixed(3),
      speed: `${Math.round(40 + Math.random() * 30)} km/h`,
      time: 'Just now',
      severity: template.fine === '₹2,000' || template.type.includes('Helmet') ? 'crimson' : 'gold',
      section: template.section,
      desc: template.desc,
      fine: template.fine
    };

    VIOLATIONS_LOG.unshift(newVio);
    if (VIOLATIONS_LOG.length > 12) VIOLATIONS_LOG.pop();
    renderViolationsFeed();
  }, 16000);
}

/* ===================================================================
   SYSTEM ARCHITECTURE MODAL & PIPELINE DIAGNOSTIC
   =================================================================== */

function initArchitectureModal() {
  const modal = document.getElementById('architectureModal');
  const openBtn = document.getElementById('btnOpenArchitecture');
  const closeBtn = document.getElementById('btnCloseArchitecture');
  const detailsBox = document.getElementById('pipeNodeDetails');

  openBtn?.addEventListener('click', () => {
    modal.classList.add('active');
    renderPipelineDetails('rtsp');
  });

  closeBtn?.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  // Clickable Pipeline Nodes
  const nodes = document.querySelectorAll('.pipeline-node');
  nodes.forEach(node => {
    node.addEventListener('click', () => {
      nodes.forEach(n => n.classList.remove('active-node'));
      node.classList.add('active-node');
      const stageKey = node.getAttribute('data-node');
      renderPipelineDetails(stageKey);
    });
  });

  // Diagnostic Stress Test Trigger
  document.getElementById('btnRunDiagnostic')?.addEventListener('click', () => {
    showToast('Running NVIDIA TensorRT & ByteTrack Diagnostic Pipeline Stress Test...', 'gold');
    setTimeout(() => {
      showToast('Diagnostic Benchmark Passed: 11.2ms inference latency • 60.0 FPS • 0 dropped frames!', 'crimson');
    }, 1500);
  });
}

function renderPipelineDetails(stageKey) {
  const spec = PIPELINE_SPECS[stageKey] || PIPELINE_SPECS.rtsp;
  const box = document.getElementById('pipeNodeDetails');
  if (!box) return;

  box.innerHTML = `
    <div style="font-size: 1rem; font-weight: 800; color: #990000; margin-bottom: 0.35rem;">
      ${spec.title}
    </div>
    <p style="font-size: 0.8rem; color: #4A5568; line-height: 1.5; margin-bottom: 0.85rem;">
      ${spec.desc}
    </p>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem;">
      ${spec.metrics.map(m => `
        <div style="background: #FFFFFF; padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid #E2E8F0;">
          <div style="font-size: 0.68rem; color: #718096; text-transform: uppercase; font-weight: 600;">${m.label}</div>
          <div style="font-size: 0.85rem; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #1A1A1A;">${m.val}</div>
        </div>
      `).join('')}
    </div>
  `;
}

/* ===================================================================
   FUNCTIONAL REPORT EXPORT SUITE: GEOJSON, CSV & PRINT PDF
   =================================================================== */

function initExportSuite() {
  const anchor = document.getElementById('downloadAnchor');

  // 1. Export RFC 7946 GeoJSON Heatmap
  document.getElementById('btnExportGeoJson')?.addEventListener('click', () => {
    const geoJsonData = {
      type: 'FeatureCollection',
      metadata: {
        title: 'TRANSIT SENSE AI - Indian Metropolitan Corridor Traffic Density Heatmap',
        generator: 'YOLOv11+ByteTrack Edge Pipeline',
        timestamp: new Date().toISOString(),
        standard: 'RFC 7946 GeoJSON'
      },
      features: [
        // Point features for all 11 monitored cities
        ...CITIES_DATA.map(c => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [c.coords[1], c.coords[0]] // [lon, lat]
          },
          properties: {
            city_id: c.id,
            city_name: c.name,
            junction_name: c.junction,
            region: c.region,
            congestion_level: c.status.toUpperCase(),
            speed_limit_kmh: c.speedLimit,
            active_cameras: c.cameras,
            counts_auto_rickshaw: c.counts.auto,
            counts_two_wheeler: c.counts.bike,
            counts_cars: c.counts.car,
            counts_heavy_bus_truck: c.counts.heavy,
            counts_pedestrian: c.counts.pedestrian,
            lane_congestion_index_avg: Math.round(c.lci.reduce((a, b) => a + b, 0) / 4)
          }
        })),
        // Polygon features representing corridor congestion boundary zones
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [77.618, 12.915], [77.625, 12.915], [77.625, 12.920], [77.618, 12.920], [77.618, 12.915]
            ]]
          },
          properties: {
            zone_name: 'Bangalore Silk Board Core Gridlock Polygon Zone',
            congestion_severity: 'CRITICAL',
            vehicle_density_per_sqkm: 4200
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [72.865, 19.110], [72.875, 19.110], [72.875, 19.118], [72.865, 19.118], [72.865, 19.110]
            ]]
          },
          properties: {
            zone_name: 'Mumbai WEH Andheri Arterial Flyover Polygon Zone',
            congestion_severity: 'HEAVY',
            vehicle_density_per_sqkm: 3850
          }
        }
      ]
    };

    const blob = new Blob([JSON.stringify(geoJsonData, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    anchor.href = url;
    anchor.download = `india_traffic_heatmap_${Date.now()}.geojson`;
    anchor.click();
    URL.revokeObjectURL(url);

    showToast('Downloaded RFC 7946 GeoJSON Density Heatmap with all 11 Indian Metro Corridors!', 'gold');
  });

  // 2. Export Density CSV Logs
  document.getElementById('btnExportCsv')?.addEventListener('click', () => {
    let csvContent = 'Timestamp_IST,City_ID,City_Name,Junction_Corridor,Camera_ID,Tracker_ID,Vehicle_Class,Confidence_Score,Speed_KMH,Lane_Assignment,LCI_Score,Violation_Flag,E_Challan_Section\n';

    // Populate with real-time telemetry from active and past vehicles
    const now = new Date().toISOString();
    trackedVehicles.forEach(v => {
      csvContent += `${now},${activeCity.id},"${activeCity.name}","${activeCity.junction}",${activeCity.camId},#${v.id},"${v.vClass.name}",${v.confidence},${v.speedKmh},"${v.lane}",${activeCity.lci[0]}%,NO,NONE\n`;
    });

    // Append active violations
    VIOLATIONS_LOG.forEach(vio => {
      csvContent += `${now},${activeCity.id},"${activeCity.name}","${activeCity.junction}",${activeCity.camId},#${vio.id},"${vio.vehicle}",${vio.confidence},${vio.speed},"Lane 2",88%,YES,"${vio.section}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    anchor.href = url;
    anchor.download = `traffic_telemetry_density_log_${Date.now()}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);

    showToast('Exported Comprehensive Telemetry & Violation CSV Dataset!', 'crimson');
  });

  // 3. Print / PDF Executive Corridor Audit Report
  document.getElementById('btnPrintReport')?.addEventListener('click', () => {
    window.print();
  });
}

// Toast Notification Utility
function showToast(message, type = 'gold') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'crimson' ? 'toast-crimson' : ''}`;
  toast.innerHTML = `
    <span style="color: ${type === 'crimson' ? '#990000' : '#D4AF37'}; font-size: 1.1rem;">●</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ===================================================================
   EVENT LISTENERS & APP INITIALIZATION
   =================================================================== */

function initEventListeners() {
  // Dual View Toggle: Raw vs. Neural Overlay
  const btnRaw = document.getElementById('btnToggleRaw');
  const btnNeural = document.getElementById('btnToggleNeural');

  btnRaw?.addEventListener('click', () => {
    isNeuralActive = false;
    btnRaw.classList.add('raw-active');
    btnNeural.classList.remove('active');
    showToast('Raw CCTV mode activated: Annotations suppressed', 'gold');
  });

  btnNeural?.addEventListener('click', () => {
    isNeuralActive = true;
    btnNeural.classList.add('active');
    btnRaw.classList.remove('raw-active');
    showToast('Neural Vision mode activated: YOLOv11 + ByteTrack overlays rendering', 'crimson');
  });

  // Video Source Selector
  const sourceSelect = document.getElementById('videoSourceSelect');
  const videoElem = document.getElementById('trafficVideo');
  const fileInput = document.getElementById('localVideoUpload');

  sourceSelect?.addEventListener('change', (e) => {
    const val = e.target.value;
    if (val === 'highway') {
      isSimulationMode = false;
      videoElem.style.display = 'block';
      videoElem.src = '/videos/traffic_highway.mp4';
      videoElem.play().catch(() => {});
      showToast('Switched to Real Camera 1: High-Density Express Corridor', 'gold');
    } else if (val === 'urban') {
      isSimulationMode = false;
      videoElem.style.display = 'block';
      videoElem.src = '/videos/traffic_urban.mp4';
      videoElem.play().catch(() => {});
      showToast('Switched to Real Camera 2: Multi-Lane Urban Arterial', 'gold');
    } else if (val === 'simulation') {
      isSimulationMode = true;
      videoElem.style.display = 'none';
      showToast('Switched to Indian Heterogeneous Traffic Mode (Autos, Bikes, Buses)', 'crimson');
    } else if (val === 'custom') {
      fileInput.click();
    }
  });

  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      isSimulationMode = false;
      videoElem.style.display = 'block';
      videoElem.src = URL.createObjectURL(file);
      videoElem.play().catch(() => {});
      showToast(`Loaded user video stream: ${file.name}`, 'gold');
    }
  });

  // Confidence Threshold Range
  const confSlider = document.getElementById('confidenceRange');
  const confVal = document.getElementById('confidenceVal');
  confSlider?.addEventListener('input', (e) => {
    const val = (e.target.value / 100).toFixed(2);
    confidenceThreshold = parseFloat(val);
    confVal.textContent = val;
  });

  // Populate City Ticker Strip
  const strip = document.getElementById('cityStrip');
  if (strip) {
    CITIES_DATA.forEach(city => {
      const pill = document.createElement('div');
      pill.className = `city-pill ${city.id === activeCity.id ? 'active' : ''}`;
      pill.setAttribute('data-city', city.id);
      pill.innerHTML = `
        <span>${city.name}</span>
        <span class="pill-tag ${city.status}">${city.status.toUpperCase()}</span>
      `;
      pill.addEventListener('click', () => selectCity(city.id));
      strip.appendChild(pill);
    });
  }

  // Live IST Clock
  setInterval(() => {
    const clockEl = document.getElementById('istClock');
    const hudTimeEl = document.getElementById('hudTimestamp');
    const istTime = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false });
    const fullDate = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (clockEl) clockEl.textContent = `${istTime} IST`;
    if (hudTimeEl) hudTimeEl.textContent = `${fullDate} IST`;
  }, 1000);

  // Close Violation Modal
  document.getElementById('btnCloseViolation')?.addEventListener('click', () => {
    document.getElementById('violationModal').classList.remove('active');
  });

  // Dispatch E-Challan Trigger
  document.getElementById('btnIssueChallan')?.addEventListener('click', () => {
    const plate = document.getElementById('echallanPlate').textContent;
    showToast(`Digital E-Challan dispatched to MoRTH Vahan Portal for ${plate}!`, 'crimson');
    document.getElementById('violationModal').classList.remove('active');
  });

  // Dismiss Challan Trigger
  document.getElementById('btnDismissChallan')?.addEventListener('click', () => {
    showToast('Violation marked as False Positive in audit log', 'gold');
    document.getElementById('violationModal').classList.remove('active');
  });
}

// Global App Initialization on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  startNeuralEngine();
  initIndianMapHub();
  initAnalyticsCharts();
  renderViolationsFeed();
  startViolationStreamSimulation();
  initArchitectureModal();
  initExportSuite();
  updateCountersUI();
  updateLciGauges(activeCity.lci, activeCity.avgSpeed);
});
