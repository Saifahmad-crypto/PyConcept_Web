// PyVerse Project Storage & Sharing Engine

export interface LogicBlock {
  id: string;
  type: 'start' | 'input' | 'condition' | 'action' | 'loop' | 'end';
  label: string;
  variableName?: string;
  operator?: '==' | '!=' | '>' | '<' | '>=' | '<=';
  conditionValue?: string | number;
  actionCode?: string;
  iterations?: number;
  children?: LogicBlock[];
  elseChildren?: LogicBlock[];
}

export type SystemSimulationType = 'security-gate' | 'smart-thermostat' | 'warehouse-rover' | 'traffic-light';

export interface SystemInputConfig {
  id: string;
  label: string;
  type: 'number' | 'boolean' | 'select';
  defaultValue: any;
  currentValue: any;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: any }[];
}

export interface PyVerseProject {
  id: string;
  title: string;
  description: string;
  simulationType: SystemSimulationType;
  blocks: LogicBlock[];
  pythonCode: string;
  inputs: SystemInputConfig[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'pyverse_custom_projects_v1';

export const DEFAULT_PROJECT_TEMPLATES: Record<SystemSimulationType, Omit<PyVerseProject, 'id' | 'createdAt' | 'updatedAt'>> = {
  'security-gate': {
    title: 'Smart Security Barrier',
    description: 'Autonomous vehicle scanner with RFID authorization and automatic safety beam.',
    simulationType: 'security-gate',
    inputs: [
      { id: 'hasValidPass', label: 'RFID Badge Valid', type: 'boolean', defaultValue: true, currentValue: true },
      { id: 'vehicleWeight', label: 'Vehicle Weight (tons)', type: 'number', defaultValue: 3, currentValue: 3, min: 1, max: 20 },
      { id: 'emergencyMode', label: 'Emergency Override', type: 'boolean', defaultValue: false, currentValue: false },
    ],
    blocks: [
      { id: 'b_start', type: 'start', label: 'System Boot & Scan' },
      {
        id: 'b_cond1',
        type: 'condition',
        label: 'If Emergency Override Active',
        variableName: 'emergencyMode',
        operator: '==',
        conditionValue: 'True',
        children: [
          { id: 'b_act1', type: 'action', label: 'Raise Barrier & Sound Alarm', actionCode: 'barrier = "OPEN"\nalarm = "RED_ALERT"' }
        ],
        elseChildren: [
          {
            id: 'b_cond2',
            type: 'condition',
            label: 'If Badge Valid AND Weight <= 12',
            variableName: 'hasValidPass',
            operator: '==',
            conditionValue: 'True',
            children: [
              { id: 'b_act2', type: 'action', label: 'Authorize Entry & Open Barrier', actionCode: 'barrier = "OPEN"\ngreen_light = True' }
            ],
            elseChildren: [
              { id: 'b_act3', type: 'action', label: 'Deny Access & Flash Warning', actionCode: 'barrier = "LOCKED"\nwarning = "UNAUTHORIZED"' }
            ]
          }
        ]
      },
      { id: 'b_end', type: 'end', label: 'Log Security Event' }
    ],
    pythonCode: `# Smart Security Barrier Logic
# Synchronized with PyVerse Logic Blocks & Simulation Stage

hasValidPass = True
vehicleWeight = 3
emergencyMode = False

if emergencyMode == True:
    barrier = "OPEN"
    alarm = "RED_ALERT"
    print("EMERGENCY OVERRIDE: Barrier raised unconditionally.")
else:
    if hasValidPass == True and vehicleWeight <= 12:
        barrier = "OPEN"
        green_light = True
        print("ACCESS GRANTED: Welcome, authorized vehicle!")
    else:
        barrier = "LOCKED"
        warning = "UNAUTHORIZED"
        print("ACCESS DENIED: Weight limit exceeded or missing RFID pass.")
`
  },

  'smart-thermostat': {
    title: 'Precision Climate Control',
    description: 'Eco-conscious climate controller balancing temperature, humidity, and room occupancy.',
    simulationType: 'smart-thermostat',
    inputs: [
      { id: 'roomTemp', label: 'Room Temperature (°C)', type: 'number', defaultValue: 28, currentValue: 28, min: 15, max: 40 },
      { id: 'isOccupied', label: 'Motion Detected', type: 'boolean', defaultValue: true, currentValue: true },
      { id: 'targetTemp', label: 'Target Setpoint (°C)', type: 'number', defaultValue: 22, currentValue: 22, min: 18, max: 28 }
    ],
    blocks: [
      { id: 't_start', type: 'start', label: 'Sample Ambient Sensors' },
      {
        id: 't_cond1',
        type: 'condition',
        label: 'If Motion Detected == False',
        variableName: 'isOccupied',
        operator: '==',
        conditionValue: 'False',
        children: [
          { id: 't_act_eco', type: 'action', label: 'Activate Eco Standby', actionCode: 'ac_power = "ECO_STANDBY"\nfan_speed = 0' }
        ],
        elseChildren: [
          {
            id: 't_cond2',
            type: 'condition',
            label: 'If roomTemp > targetTemp',
            variableName: 'roomTemp',
            operator: '>',
            conditionValue: '22',
            children: [
              { id: 't_act_cool', type: 'action', label: 'Engage Max Cooling Turbo', actionCode: 'ac_power = "COOLING"\nfan_speed = 3' }
            ],
            elseChildren: [
              { id: 't_act_opt', type: 'action', label: 'Maintain Desired Comfort', actionCode: 'ac_power = "MAINTAIN"\nfan_speed = 1' }
            ]
          }
        ]
      },
      { id: 't_end', type: 'end', label: 'Display Status & Sleep 10s' }
    ],
    pythonCode: `# Precision Climate Control Logic
# Synchronized with PyVerse Logic Blocks & Simulation Stage

roomTemp = 28
isOccupied = True
targetTemp = 22

if isOccupied == False:
    ac_power = "ECO_STANDBY"
    fan_speed = 0
    print("STANDBY: Room empty, conserving energy.")
else:
    if roomTemp > targetTemp:
        ac_power = "COOLING"
        fan_speed = 3
        print(f"COOLING ACTIVE: Bringing temp from {roomTemp}C down to {targetTemp}C.")
    else:
        ac_power = "MAINTAIN"
        fan_speed = 1
        print("COMFORT OPTIMAL: Target temperature achieved.")
`
  },

  'warehouse-rover': {
    title: 'Autonomous AGV Rover',
    description: 'Path-finding warehouse rover running loop cycles with obstacle avoidance.',
    simulationType: 'warehouse-rover',
    inputs: [
      { id: 'batteryLevel', label: 'Battery Level (%)', type: 'number', defaultValue: 85, currentValue: 85, min: 5, max: 100 },
      { id: 'cargoUnits', label: 'Cargo Pallets', type: 'number', defaultValue: 4, currentValue: 4, min: 1, max: 10 },
      { id: 'obstacleDistance', label: 'Sonar Distance (cm)', type: 'number', defaultValue: 120, currentValue: 120, min: 10, max: 300 }
    ],
    blocks: [
      { id: 'w_start', type: 'start', label: 'Initialize Navigation LiDAR' },
      {
        id: 'w_cond1',
        type: 'condition',
        label: 'If batteryLevel < 20',
        variableName: 'batteryLevel',
        operator: '<',
        conditionValue: '20',
        children: [
          { id: 'w_act_charge', type: 'action', label: 'Return to Dock & Charge', actionCode: 'rover_status = "DOCKING"\nmotor_speed = 0' }
        ],
        elseChildren: [
          {
            id: 'w_loop',
            type: 'loop',
            label: 'For each Pallet Delivery (cargoUnits)',
            iterations: 4,
            children: [
              { id: 'w_act_move', type: 'action', label: 'Navigate Waypoint & Unload', actionCode: 'position += 1\ndelivered += 1' }
            ]
          },
          { id: 'w_act_done', type: 'action', label: 'Mission Completed', actionCode: 'rover_status = "READY"' }
        ]
      },
      { id: 'w_end', type: 'end', label: 'Log Telemetry to Base' }
    ],
    pythonCode: `# Autonomous AGV Rover Logic
# Synchronized with PyVerse Logic Blocks & Simulation Stage

batteryLevel = 85
cargoUnits = 4
obstacleDistance = 120

if batteryLevel < 20:
    rover_status = "DOCKING"
    motor_speed = 0
    print("LOW BATTERY: Rerouting AGV directly to charging dock.")
else:
    position = 0
    delivered = 0
    for pallet in range(1, cargoUnits + 1):
        position += 1
        delivered += 1
        print(f"Waystation {position}: Pallet #{pallet} delivered successfully.")
    rover_status = "READY"
    print("ALL DELIVERIES COMPLETE: Standby at depot.")
`
  },

  'traffic-light': {
    title: 'Adaptive Junction Grid',
    description: 'Smart traffic light system adjusting phase durations based on queue density.',
    simulationType: 'traffic-light',
    inputs: [
      { id: 'vehicleQueue', label: 'Waiting Vehicles', type: 'number', defaultValue: 14, currentValue: 14, min: 0, max: 50 },
      { id: 'pedestrianWaiting', label: 'Pedestrian Cross Button', type: 'boolean', defaultValue: false, currentValue: false },
      { id: 'ambulanceDetected', label: 'Emergency Siren Detector', type: 'boolean', defaultValue: false, currentValue: false }
    ],
    blocks: [
      { id: 'tf_start', type: 'start', label: 'Scan Intersection Radar' },
      {
        id: 'tf_cond1',
        type: 'condition',
        label: 'If ambulanceDetected == True',
        variableName: 'ambulanceDetected',
        operator: '==',
        conditionValue: 'True',
        children: [
          { id: 'tf_act_siren', type: 'action', label: 'Priority Green Corridor', actionCode: 'light = "GREEN_CORRIDOR"\nsiren_alert = True' }
        ],
        elseChildren: [
          {
            id: 'tf_cond2',
            type: 'condition',
            label: 'If pedestrianWaiting == True',
            variableName: 'pedestrianWaiting',
            operator: '==',
            conditionValue: 'True',
            children: [
              { id: 'tf_act_ped', type: 'action', label: 'Pedestrian Safe Walk Phase', actionCode: 'light = "RED"\nwalk_sign = "SAFE_TO_WALK"' }
            ],
            elseChildren: [
              {
                id: 'tf_cond3',
                type: 'condition',
                label: 'If vehicleQueue > 10',
                variableName: 'vehicleQueue',
                operator: '>',
                conditionValue: '10',
                children: [
                  { id: 'tf_act_long', type: 'action', label: 'Extended Green Phase (45s)', actionCode: 'light = "GREEN"\nduration = 45' }
                ],
                elseChildren: [
                  { id: 'tf_act_norm', type: 'action', label: 'Standard Green Phase (20s)', actionCode: 'light = "GREEN"\nduration = 20' }
                ]
              }
            ]
          }
        ]
      },
      { id: 'tf_end', type: 'end', label: 'Cycle to Next Phase' }
    ],
    pythonCode: `# Adaptive Junction Grid Logic
# Synchronized with PyVerse Logic Blocks & Simulation Stage

vehicleQueue = 14
pedestrianWaiting = False
ambulanceDetected = False

if ambulanceDetected == True:
    light = "GREEN_CORRIDOR"
    siren_alert = True
    print("SIREN DETECTED: Opening full emergency corridor!")
else:
    if pedestrianWaiting == True:
        light = "RED"
        walk_sign = "SAFE_TO_WALK"
        print("CROSSWALK ACTIVE: Traffic stopped for pedestrians.")
    else:
        if vehicleQueue > 10:
            light = "GREEN"
            duration = 45
            print(f"HIGH CONGESTION: Queue is {vehicleQueue} cars. 45s Green light.")
        else:
            light = "GREEN"
            duration = 20
            print("NORMAL FLOW: Standard 20s Green light phase.")
`
  }
};

export function getSavedProjects(): PyVerseProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load saved projects', err);
    return [];
  }
}

export function saveProjectToStorage(project: PyVerseProject): void {
  const current = getSavedProjects();
  const index = current.findIndex(p => p.id === project.id);
  const updated = { ...project, updatedAt: new Date().toISOString() };
  if (index >= 0) {
    current[index] = updated;
  } else {
    current.unshift(updated);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

export function deleteProjectFromStorage(id: string): void {
  const current = getSavedProjects().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

export function exportProjectToJson(project: PyVerseProject): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const safeTitle = project.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
  downloadAnchor.setAttribute('download', `pyverse_project_${safeTitle}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function encodeProjectToShareUrl(project: PyVerseProject): string {
  try {
    const json = JSON.stringify(project);
    const b64 = btoa(unescape(encodeURIComponent(json)));
    const url = new URL(window.location.href);
    url.searchParams.set('project', b64);
    return url.toString();
  } catch {
    return window.location.href;
  }
}

export function decodeProjectFromUrl(): PyVerseProject | null {
  try {
    const url = new URL(window.location.href);
    const raw = url.searchParams.get('project');
    if (!raw) return null;
    const json = decodeURIComponent(escape(atob(raw)));
    const parsed = JSON.parse(json);
    if (parsed && parsed.title && parsed.blocks) {
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to parse project from URL parameter', err);
  }
  return null;
}
