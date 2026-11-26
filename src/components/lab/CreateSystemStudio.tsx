import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  Save,
  Share2,
  Download,
  Upload,
  Plus,
  Trash2,
  Sliders,
  Cpu,
  Layers,
  Code2,
  GitCommit,
  CheckCircle2,
  AlertCircle,
  Copy,
  ChevronRight,
  Sparkles,
  GripVertical
} from 'lucide-react';
import {
  LogicBlock,
  SystemSimulationType,
  SystemInputConfig,
  PyVerseProject,
  DEFAULT_PROJECT_TEMPLATES,
  getSavedProjects,
  saveProjectToStorage,
  deleteProjectFromStorage,
  exportProjectToJson,
  encodeProjectToShareUrl,
  decodeProjectFromUrl
} from '../../utils/projectStorage';

interface ExecutionStep {
  blockId: string;
  stepNumber: number;
  label: string;
  codeSnippet: string;
  variables: Record<string, any>;
  logOutput: string;
  simulationState: any;
}

export const CreateSystemStudio: React.FC = () => {
  // Current active project state
  const [project, setProject] = useState<PyVerseProject>(() => {
    const urlProject = decodeProjectFromUrl();
    if (urlProject) return urlProject;

    const initial = DEFAULT_PROJECT_TEMPLATES['security-gate'];
    return {
      ...initial,
      id: 'proj_' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });

  const [activeTab, setActiveTab] = useState<'blocks' | 'code' | 'flowchart' | 'split'>('split');
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [savedProjects, setSavedProjects] = useState<PyVerseProject[]>([]);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Simulation execution engine state
  const [executionTimeline, setExecutionTimeline] = useState<ExecutionStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1000); // ms per step
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Drag-and-drop state
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Python manual editor state
  const [editableCode, setEditableCode] = useState<string>(project.pythonCode);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'custom_code'>('synced');

  // Load saved projects on mount
  useEffect(() => {
    setSavedProjects(getSavedProjects());
  }, []);

  // Synchronize Python Code when blocks or inputs change
  useEffect(() => {
    if (syncStatus === 'synced') {
      const generated = generatePythonFromProject(project);
      setProject(prev => ({ ...prev, pythonCode: generated }));
      setEditableCode(generated);
    }
  }, [project.blocks, project.inputs, syncStatus]);

  // Compile execution timeline whenever blocks, inputs or simulation type change
  useEffect(() => {
    const timeline = compileExecutionTimeline(project);
    setExecutionTimeline(timeline);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [project.blocks, project.inputs, project.simulationType]);

  // Stepping playback loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < executionTimeline.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, playSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, executionTimeline.length, playSpeed]);

  // Current active step
  const currentStep: ExecutionStep | undefined = executionTimeline[currentStepIndex];

  // Handle Input Changes in Experiment Mode
  const handleInputChange = (inputId: string, value: any) => {
    setProject(prev => ({
      ...prev,
      inputs: prev.inputs.map(inp => (inp.id === inputId ? { ...inp, currentValue: value } : inp))
    }));
  };

  // Switch Template
  const handleSelectTemplate = (type: SystemSimulationType) => {
    const tpl = DEFAULT_PROJECT_TEMPLATES[type];
    setProject({
      ...tpl,
      id: 'proj_' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setSyncStatus('synced');
  };

  // Save Project
  const handleSave = () => {
    saveProjectToStorage(project);
    setSavedProjects(getSavedProjects());
    setSaveToast('Project saved successfully to local vault!');
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Export Project JSON
  const handleExport = () => {
    exportProjectToJson(project);
  };

  // Import Project JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed.title && parsed.blocks) {
          setProject(parsed);
          setEditableCode(parsed.pythonCode || generatePythonFromProject(parsed));
          setSaveToast(`Imported "${parsed.title}" successfully!`);
          setTimeout(() => setSaveToast(null), 3000);
        }
      } catch {
        alert('Invalid project JSON file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Share Project URL
  const handleShare = () => {
    const shareUrl = encodeProjectToShareUrl(project);
    navigator.clipboard.writeText(shareUrl).then(() => {
      setSaveToast('Share link copied to clipboard!');
      setTimeout(() => setSaveToast(null), 3000);
    });
  };

  // Drag and Drop Logic Block Handling
  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedItemIndex === null || draggedItemIndex === index) {
      setDraggedItemIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...project.blocks];
    const [moved] = reordered.splice(draggedItemIndex, 1);
    reordered.splice(index, 0, moved);

    setProject(prev => ({ ...prev, blocks: reordered }));
    setDraggedItemIndex(null);
    setDragOverIndex(null);
  };

  // Block Manipulation
  const handleAddBlock = (type: LogicBlock['type']) => {
    const newBlock: LogicBlock = {
      id: 'b_' + Math.random().toString(36).substring(2, 7),
      type,
      label: type === 'condition' ? 'If Custom Sensor Triggered' : type === 'action' ? 'Trigger Actuator' : type === 'loop' ? 'Iterate Cycle' : 'Step Logic',
      variableName: project.inputs[0]?.id || 'sensorInput',
      operator: '==',
      conditionValue: 'True',
      actionCode: 'system_active = True',
      children: []
    };

    // Insert before end block if exists
    const endIndex = project.blocks.findIndex(b => b.type === 'end');
    const updated = [...project.blocks];
    if (endIndex >= 0) {
      updated.splice(endIndex, 0, newBlock);
    } else {
      updated.push(newBlock);
    }
    setProject(prev => ({ ...prev, blocks: updated }));
  };

  const handleDeleteBlock = (id: string) => {
    setProject(prev => ({
      ...prev,
      blocks: prev.blocks.filter(b => b.id !== id)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Studio Header & Top Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#100303] via-[#090101] to-[#140505] border border-red-950/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-red-400 bg-red-950/80 rounded border border-red-800/40">
                  CREATE MODE &bull; UNIFIED ENGINE
                </span>
                <span className="text-xs text-stone-500 font-mono">Bi-Directional Logic</span>
              </div>
              <h2 className="text-2xl font-bold text-stone-100 flex items-center gap-2">
                {project.title}
              </h2>
            </div>
          </div>
          <p className="text-xs text-stone-400 max-w-2xl">{project.description}</p>
        </div>

        {/* Toolbar Actions */}
        <div className="flex items-center flex-wrap gap-2 z-10">
          {/* Preset Selector */}
          <div className="flex items-center bg-black/60 border border-stone-800 rounded-xl p-1">
            {(['security-gate', 'smart-thermostat', 'warehouse-rover', 'traffic-light'] as SystemSimulationType[]).map(type => (
              <button
                key={type}
                onClick={() => handleSelectTemplate(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  project.simulationType === type
                    ? 'bg-red-600/20 text-red-300 border border-red-500/40 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {type === 'security-gate' && 'Security Gate'}
                {type === 'smart-thermostat' && 'Thermostat'}
                {type === 'warehouse-rover' && 'AGV Rover'}
                {type === 'traffic-light' && 'Traffic Grid'}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700/60 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95"
            title="Save Project"
          >
            <Save className="w-3.5 h-3.5 text-red-400" />
            Save
          </button>

          <button
            onClick={() => setIsSavedDrawerOpen(!isSavedDrawerOpen)}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700/60 rounded-xl text-xs font-semibold transition-all shadow-sm"
            title="My Saved Projects Vault"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Projects ({savedProjects.length})
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700/60 rounded-xl text-xs font-semibold transition-all shadow-sm"
            title="Copy Shareable Link"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-400" />
            Share
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700/60 rounded-xl text-xs font-semibold transition-all shadow-sm"
            title="Export JSON"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Export
          </button>

          <label className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700/60 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-purple-400" />
            Import
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-stone-900 text-stone-100 border border-red-500/60 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-medium">{saveToast}</span>
        </div>
      )}

      {/* Saved Projects Drawer */}
      {isSavedDrawerOpen && (
        <div className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-semibold text-stone-200">Your Saved Projects Vault</h4>
            </div>
            <button
              onClick={() => setIsSavedDrawerOpen(false)}
              className="text-xs text-stone-400 hover:text-stone-200"
            >
              Close
            </button>
          </div>

          {savedProjects.length === 0 ? (
            <p className="text-xs text-stone-500 py-3">No custom saved projects yet. Click "Save" above to bookmark current system.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {savedProjects.map(p => (
                <div
                  key={p.id}
                  className="p-3 rounded-lg bg-black/60 border border-stone-800 hover:border-red-600/50 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-200 truncate">{p.title}</span>
                      <span className="text-[10px] text-stone-500 font-mono">{p.simulationType}</span>
                    </div>
                    <p className="text-[11px] text-stone-400 line-clamp-2">{p.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-800/80">
                    <button
                      onClick={() => {
                        setProject(p);
                        setEditableCode(p.pythonCode);
                        setIsSavedDrawerOpen(false);
                      }}
                      className="text-xs font-semibold text-red-400 hover:text-red-300"
                    >
                      Open Project
                    </button>
                    <button
                      onClick={() => {
                        deleteProjectFromStorage(p.id);
                        setSavedProjects(getSavedProjects());
                      }}
                      className="text-stone-500 hover:text-red-400 p-1"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Grid: Control & Experiment Station vs Logic & Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Experiment Controls & Variable Inspector (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Experiment Mode: Real-world Inputs */}
          <div className="p-4 rounded-2xl bg-[#0e0404] border border-red-950/70 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-red-950/60 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-bold text-stone-200 uppercase tracking-wider">
                  Experiment Mode &bull; Inputs
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                LIVE OVERRIDE
              </span>
            </div>

            <p className="text-xs text-stone-400">
              Adjust sensor values or state triggers to immediately test conditional logic pathways.
            </p>

            <div className="space-y-4 pt-1">
              {project.inputs.map(input => (
                <div key={input.id} className="p-3 rounded-xl bg-black/40 border border-stone-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-stone-300">{input.label}</label>
                    <span className="font-mono text-xs text-red-400 font-semibold">
                      {String(input.currentValue)}
                    </span>
                  </div>

                  {input.type === 'boolean' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleInputChange(input.id, true)}
                        className={`flex-1 py-1.5 text-xs font-mono font-medium rounded-lg border transition-all ${
                          input.currentValue === true
                            ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                            : 'bg-stone-900/40 text-stone-400 border-stone-800'
                        }`}
                      >
                        True
                      </button>
                      <button
                        onClick={() => handleInputChange(input.id, false)}
                        className={`flex-1 py-1.5 text-xs font-mono font-medium rounded-lg border transition-all ${
                          input.currentValue === false
                            ? 'bg-red-600/20 text-red-300 border-red-500/40 shadow-sm'
                            : 'bg-stone-900/40 text-stone-400 border-stone-800'
                        }`}
                      >
                        False
                      </button>
                    </div>
                  )}

                  {input.type === 'number' && (
                    <div className="space-y-1">
                      <input
                        type="range"
                        min={input.min ?? 0}
                        max={input.max ?? 100}
                        step={input.step ?? 1}
                        value={input.currentValue}
                        onChange={e => handleInputChange(input.id, parseFloat(e.target.value))}
                        className="w-full accent-red-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                        <span>Min: {input.min ?? 0}</span>
                        <span>Max: {input.max ?? 100}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stepper & Debugger Controller */}
          <div className="p-4 rounded-2xl bg-[#0e0404] border border-red-950/70 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-red-950/60 pb-3">
              <div className="flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-bold text-stone-200 uppercase tracking-wider">
                  Step Execution & Debugger
                </h3>
              </div>
              <span className="text-[10px] font-mono text-stone-400">
                Step {currentStepIndex + 1} / {executionTimeline.length}
              </span>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-3 py-2 bg-black/40 rounded-xl border border-stone-800/80">
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIndex(0);
                }}
                className="p-2 text-stone-400 hover:text-stone-200 rounded-lg hover:bg-stone-800/60 transition-all"
                title="Restart Execution"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (currentStepIndex > 0) {
                    setIsPlaying(false);
                    setCurrentStepIndex(prev => prev - 1);
                  }
                }}
                disabled={currentStepIndex <= 0}
                className="p-2 text-stone-400 hover:text-stone-200 disabled:opacity-40 rounded-lg hover:bg-stone-800/60 transition-all"
                title="Step Back"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-900/30 flex items-center gap-1.5 transition-all active:scale-95 text-xs"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                {isPlaying ? 'Pause' : 'Play Live'}
              </button>

              <button
                onClick={() => {
                  if (currentStepIndex < executionTimeline.length - 1) {
                    setIsPlaying(false);
                    setCurrentStepIndex(prev => prev + 1);
                  }
                }}
                disabled={currentStepIndex >= executionTimeline.length - 1}
                className="p-2 text-stone-400 hover:text-stone-200 disabled:opacity-40 rounded-lg hover:bg-stone-800/60 transition-all"
                title="Step Forward"
              >
                <StepForward className="w-4 h-4" />
              </button>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center justify-between text-xs text-stone-400 px-1">
              <span>Step Speed:</span>
              <div className="flex gap-1">
                {[1500, 1000, 500].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setPlaySpeed(speed)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                      playSpeed === speed ? 'bg-red-600/30 text-red-300 font-bold border border-red-500/40' : 'text-stone-500 hover:text-stone-300'
                    }`}
                  >
                    {speed === 1500 ? '0.75x' : speed === 1000 ? '1.0x' : '2.0x'}
                  </button>
                ))}
              </div>
            </div>

            {/* Variable Memory State Inspector */}
            <div className="space-y-2 pt-2 border-t border-stone-900">
              <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">
                Active Variable Memory State:
              </span>
              <div className="p-3 bg-black/60 rounded-xl border border-stone-800 font-mono text-xs space-y-1">
                {currentStep ? (
                  Object.entries(currentStep.variables).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center text-stone-300">
                      <span className="text-amber-400/90">{key}:</span>
                      <span className="text-emerald-400 font-bold">{JSON.stringify(val)}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-stone-500 italic">No variables loaded</span>
                )}
              </div>
            </div>

            {/* Console Log Output */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">
                Standard Output (Console):
              </span>
              <div className="p-3 bg-black/80 rounded-xl border border-stone-800 font-mono text-xs text-stone-300 min-h-[60px] whitespace-pre-wrap leading-relaxed">
                {currentStep?.logOutput ? (
                  <span className="text-green-400 font-mono">&gt; {currentStep.logOutput}</span>
                ) : (
                  <span className="text-stone-600 italic">Waiting for execution step...</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Unified Dual Workstation (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* View Mode Tabs */}
          <div className="flex items-center justify-between border-b border-red-950/60 pb-2">
            <div className="flex items-center gap-1 bg-[#100303] p-1 rounded-xl border border-red-950/70">
              <button
                onClick={() => setActiveTab('split')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'split' ? 'bg-red-600 text-white shadow-md' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Live Simulation & Blocks
              </button>

              <button
                onClick={() => setActiveTab('flowchart')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'flowchart' ? 'bg-red-600 text-white shadow-md' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <GitCommit className="w-3.5 h-3.5" />
                Flowchart View
              </button>

              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'code' ? 'bg-red-600 text-white shadow-md' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                Python Code View
              </button>

              <button
                onClick={() => setActiveTab('blocks')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'blocks' ? 'bg-red-600 text-white shadow-md' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                Block Editor
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-stone-400">
                Active Node: <span className="text-red-400 font-bold">{currentStep?.blockId || 'none'}</span>
              </span>
            </div>
          </div>

          {/* Real-World Live Simulation Stage */}
          <div className="p-5 rounded-2xl bg-[#0e0404] border border-red-950/70 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-bold text-stone-200 uppercase tracking-wider">
                  Live Interactive Simulation
                </h3>
              </div>
              <span className="text-xs font-mono text-stone-400">
                Target: {project.simulationType}
              </span>
            </div>

            {/* Simulation Canvas Rendering */}
            <div className="relative w-full h-64 rounded-xl bg-gradient-to-b from-[#140505] to-[#070101] border border-red-950/80 overflow-hidden flex items-center justify-center">
              {renderLiveSimulationStage(project.simulationType, currentStep?.simulationState || {}, currentStep)}
            </div>
          </div>

          {/* Primary View Workspace */}
          {activeTab === 'split' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Blocks Panel */}
              <div className="p-4 rounded-2xl bg-[#0e0404] border border-red-950/70 space-y-3">
                <div className="flex items-center justify-between border-b border-red-950/50 pb-2">
                  <span className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                    <GripVertical className="w-3.5 h-3.5 text-red-400" />
                    Drag & Drop Blocks
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleAddBlock('condition')}
                      className="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-[10px] font-bold text-red-400 border border-stone-800 rounded"
                    >
                      + Condition
                    </button>
                    <button
                      onClick={() => handleAddBlock('action')}
                      className="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-[10px] font-bold text-blue-400 border border-stone-800 rounded"
                    >
                      + Action
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {project.blocks.map((block, idx) => (
                    <div
                      key={block.id}
                      draggable={block.type !== 'start' && block.type !== 'end'}
                      onDragStart={() => handleDragStart(idx)}
                      onDragOver={e => handleDragOver(e, idx)}
                      onDrop={() => handleDrop(idx)}
                      className={`p-3 rounded-xl border transition-all ${
                        currentStep?.blockId === block.id
                          ? 'border-red-500 bg-red-950/30 shadow-lg shadow-red-950/50 ring-1 ring-red-500'
                          : dragOverIndex === idx
                          ? 'border-red-400 bg-red-950/40'
                          : 'border-stone-800/80 bg-black/40 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-3.5 h-3.5 text-stone-600 cursor-grab" />
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-bold ${
                              block.type === 'start' || block.type === 'end'
                                ? 'bg-purple-950/70 text-purple-400 border border-purple-800/40'
                                : block.type === 'condition'
                                ? 'bg-amber-950/70 text-amber-400 border border-amber-800/40'
                                : block.type === 'loop'
                                ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/40'
                                : 'bg-blue-950/70 text-blue-400 border border-blue-800/40'
                            }`}
                          >
                            {block.type}
                          </span>
                          <span className="text-xs font-semibold text-stone-200">{block.label}</span>
                        </div>

                        {block.type !== 'start' && block.type !== 'end' && (
                          <button
                            onClick={() => handleDeleteBlock(block.id)}
                            className="text-stone-600 hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {block.actionCode && (
                        <div className="mt-2 text-[11px] font-mono text-stone-400 bg-black/60 p-2 rounded border border-stone-900">
                          {block.actionCode}
                        </div>
                      )}

                      {/* Nested Children for Conditions / Loops */}
                      {((block.children && block.children.length > 0) || (block.elseChildren && block.elseChildren.length > 0)) && (
                        <div className="mt-2 pl-3 border-l-2 border-stone-800 space-y-1.5 pt-1">
                          {block.children && block.children.length > 0 && (
                            <div className="space-y-1">
                              <span className="text-[9px] font-mono text-emerald-400 uppercase font-semibold">↳ If True:</span>
                              {block.children.map(ch => (
                                <div key={ch.id} className="p-1.5 bg-stone-950 rounded border border-stone-800 text-[11px] text-stone-300 font-mono flex items-center justify-between">
                                  <span>{ch.label}</span>
                                  <span className="text-[9px] text-blue-400">{ch.type}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {block.elseChildren && block.elseChildren.length > 0 && (
                            <div className="space-y-1 pt-1">
                              <span className="text-[9px] font-mono text-red-400 uppercase font-semibold">↳ Else Branch:</span>
                              {block.elseChildren.map(ech => (
                                <div key={ech.id} className="p-1.5 bg-stone-950 rounded border border-stone-800 text-[11px] text-stone-300 font-mono flex items-center justify-between">
                                  <span>{ech.label}</span>
                                  <span className="text-[9px] text-amber-400">{ech.type}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Synchronized Flowchart Preview */}
              <div className="p-4 rounded-2xl bg-[#0e0404] border border-red-950/70 space-y-3">
                <div className="flex items-center justify-between border-b border-red-950/50 pb-2">
                  <span className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                    <GitCommit className="w-3.5 h-3.5 text-red-400" />
                    Synchronized Flowchart
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">Dynamic SVG</span>
                </div>

                <div className="w-full h-[380px] bg-black/60 rounded-xl border border-stone-800/80 p-2 flex items-center justify-center overflow-auto">
                  {renderFlowchartSvg(project.blocks, currentStep?.blockId)}
                </div>
              </div>
            </div>
          )}

          {/* Full Flowchart Mode */}
          {activeTab === 'flowchart' && (
            <div className="p-5 rounded-2xl bg-[#0e0404] border border-red-950/70 space-y-3">
              <div className="flex items-center justify-between border-b border-red-950/50 pb-2">
                <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Full Flowchart Topology
                </span>
                <span className="text-xs text-stone-400">Green = Start / End &bull; Gold = Decision &bull; Blue = Action</span>
              </div>
              <div className="w-full min-h-[460px] bg-black/70 rounded-xl border border-stone-800/80 p-4 flex items-center justify-center overflow-auto">
                {renderFlowchartSvg(project.blocks, currentStep?.blockId, true)}
              </div>
            </div>
          )}

          {/* Python Code View Mode */}
          {activeTab === 'code' && (
            <div className="p-5 rounded-2xl bg-[#0e0404] border border-red-950/70 space-y-4">
              <div className="flex items-center justify-between border-b border-red-950/50 pb-3">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-bold text-stone-200 uppercase tracking-wider">
                    Synchronized Python Source Code
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(editableCode);
                      setSaveToast('Python code copied to clipboard!');
                      setTimeout(() => setSaveToast(null), 3000);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded text-xs font-mono border border-stone-800"
                  >
                    <Copy className="w-3 h-3 text-stone-400" />
                    Copy Code
                  </button>
                  <button
                    onClick={() => {
                      setSyncStatus('synced');
                      const fresh = generatePythonFromProject(project);
                      setEditableCode(fresh);
                      setProject(prev => ({ ...prev, pythonCode: fresh }));
                    }}
                    className="px-2.5 py-1 bg-red-950/60 hover:bg-red-900/60 text-red-300 rounded text-xs font-mono border border-red-800/50"
                  >
                    Regenerate from Blocks
                  </button>
                </div>
              </div>

              <div className="relative rounded-xl border border-stone-800/90 overflow-hidden">
                <textarea
                  value={editableCode}
                  onChange={e => {
                    setEditableCode(e.target.value);
                    setSyncStatus('custom_code');
                    setProject(prev => ({ ...prev, pythonCode: e.target.value }));
                  }}
                  className="w-full h-96 p-4 bg-black/90 text-stone-100 font-mono text-xs leading-relaxed focus:outline-none resize-none"
                  spellCheck={false}
                />
              </div>
            </div>
          )}

          {/* Block Editor Mode */}
          {activeTab === 'blocks' && (
            <div className="p-5 rounded-2xl bg-[#0e0404] border border-red-950/70 space-y-4">
              <div className="flex items-center justify-between border-b border-red-950/50 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-bold text-stone-200 uppercase tracking-wider">
                    Full Visual Block Graph
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddBlock('condition')}
                    className="px-3 py-1.5 bg-amber-950/60 text-amber-300 border border-amber-800/50 rounded-lg text-xs font-bold"
                  >
                    + Condition Block
                  </button>
                  <button
                    onClick={() => handleAddBlock('action')}
                    className="px-3 py-1.5 bg-blue-950/60 text-blue-300 border border-blue-800/50 rounded-lg text-xs font-bold"
                  >
                    + Action Block
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {project.blocks.map((block, idx) => (
                  <div
                    key={block.id}
                    className="p-4 rounded-xl bg-black/60 border border-stone-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-red-400">#{idx + 1}</span>
                        <input
                          type="text"
                          value={block.label}
                          onChange={e => {
                            const val = e.target.value;
                            setProject(prev => ({
                              ...prev,
                              blocks: prev.blocks.map(b => (b.id === block.id ? { ...b, label: val } : b))
                            }));
                          }}
                          className="bg-stone-900 border border-stone-800 rounded px-2 py-1 text-xs text-stone-200 font-medium"
                        />
                      </div>
                      {block.type !== 'start' && block.type !== 'end' && (
                        <button
                          onClick={() => handleDeleteBlock(block.id)}
                          className="text-stone-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {block.actionCode !== undefined && (
                      <textarea
                        value={block.actionCode}
                        onChange={e => {
                          const val = e.target.value;
                          setProject(prev => ({
                            ...prev,
                            blocks: prev.blocks.map(b => (b.id === block.id ? { ...b, actionCode: val } : b))
                          }));
                        }}
                        className="w-full p-2 bg-stone-950 border border-stone-900 rounded font-mono text-xs text-emerald-400"
                        rows={2}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// UNIFIED LOGIC COMPILER & CODE GENERATORS
// ==========================================

function generatePythonFromProject(project: PyVerseProject): string {
  let code = `# ${project.title} - PyVerse Unified Engine\n# Synchronized with Logic Blocks and Live Simulation\n\n`;

  // Inputs header
  project.inputs.forEach(inp => {
    let formattedVal = inp.currentValue;
    if (typeof inp.currentValue === 'boolean') {
      formattedVal = inp.currentValue ? 'True' : 'False';
    }
    code += `${inp.id} = ${formattedVal}\n`;
  });
  code += '\n';

  // Blocks serialization
  const serializeBlocks = (blocks: LogicBlock[], indent = 0): string => {
    let out = '';
    const pad = '    '.repeat(indent);

    for (const b of blocks) {
      if (b.type === 'start') {
        out += `${pad}print("[BOOT] ${b.label}")\n`;
      } else if (b.type === 'action') {
        if (b.actionCode) {
          const lines = b.actionCode.split('\n');
          for (const line of lines) {
            out += `${pad}${line}\n`;
          }
        }
        out += `${pad}print("${b.label}")\n`;
      } else if (b.type === 'condition') {
        out += `${pad}if ${b.variableName || 'True'} ${b.operator || '=='} ${b.conditionValue || 'True'}:\n`;
        if (b.children && b.children.length > 0) {
          out += serializeBlocks(b.children, indent + 1);
        } else {
          out += `${pad}    pass\n`;
        }
        if (b.elseChildren && b.elseChildren.length > 0) {
          out += `${pad}else:\n`;
          out += serializeBlocks(b.elseChildren, indent + 1);
        }
      } else if (b.type === 'loop') {
        out += `${pad}for cycle in range(1, ${(b.iterations || 3) + 1}):\n`;
        if (b.children && b.children.length > 0) {
          out += serializeBlocks(b.children, indent + 1);
        } else {
          out += `${pad}    pass\n`;
        }
      } else if (b.type === 'end') {
        out += `${pad}print("[HALT] ${b.label}")\n`;
      }
    }
    return out;
  };

  code += serializeBlocks(project.blocks);
  return code;
}

function compileExecutionTimeline(project: PyVerseProject): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const vars: Record<string, any> = {};

  // Initialize variables from inputs
  project.inputs.forEach(inp => {
    vars[inp.id] = inp.currentValue;
  });

  let stepNum = 1;

  const traverse = (blocks: LogicBlock[], parentSimState: any) => {
    for (const b of blocks) {
      if (b.type === 'start') {
        steps.push({
          blockId: b.id,
          stepNumber: stepNum++,
          label: b.label,
          codeSnippet: `print("${b.label}")`,
          variables: { ...vars },
          logOutput: `BOOT: System initialized. Reading input sensors...`,
          simulationState: { ...parentSimState, status: 'BOOT' }
        });
      } else if (b.type === 'condition') {
        // Evaluate condition against vars
        const varVal = vars[b.variableName || ''];
        let targetVal = b.conditionValue;
        if (targetVal === 'True') targetVal = true;
        if (targetVal === 'False') targetVal = false;
        if (typeof varVal === 'number' && typeof targetVal === 'string') {
          targetVal = parseFloat(targetVal);
        }

        let isMatch = false;
        if (b.operator === '==') isMatch = varVal === targetVal;
        else if (b.operator === '!=') isMatch = varVal !== targetVal;
        else if (b.operator === '>') isMatch = varVal > targetVal;
        else if (b.operator === '<') isMatch = varVal < targetVal;
        else if (b.operator === '>=') isMatch = varVal >= targetVal;
        else if (b.operator === '<=') isMatch = varVal <= targetVal;

        steps.push({
          blockId: b.id,
          stepNumber: stepNum++,
          label: b.label,
          codeSnippet: `if ${b.variableName} ${b.operator} ${b.conditionValue}: # Evaluated to ${isMatch}`,
          variables: { ...vars },
          logOutput: `Condition evaluated: ${b.variableName} (${varVal}) ${b.operator} ${b.conditionValue} -> ${isMatch ? 'TRUE (Taking branch)' : 'FALSE (Taking else)'}`,
          simulationState: { ...parentSimState, branch: isMatch ? 'IF_TRUE' : 'ELSE' }
        });

        if (isMatch && b.children && b.children.length > 0) {
          traverse(b.children, { ...parentSimState, branch: 'IF_TRUE' });
        } else if (!isMatch && b.elseChildren && b.elseChildren.length > 0) {
          traverse(b.elseChildren, { ...parentSimState, branch: 'ELSE' });
        }
      } else if (b.type === 'action') {
        // Execute action code into vars
        if (b.actionCode) {
          const lines = b.actionCode.split('\n');
          for (const l of lines) {
            const parts = l.split('=');
            if (parts.length === 2) {
              const k = parts[0].trim();
              const rawV = parts[1].trim().replace(/['"]/g, '');
              vars[k] = rawV === 'True' ? true : rawV === 'False' ? false : !isNaN(Number(rawV)) ? Number(rawV) : rawV;
            }
          }
        }

        steps.push({
          blockId: b.id,
          stepNumber: stepNum++,
          label: b.label,
          codeSnippet: b.actionCode || b.label,
          variables: { ...vars },
          logOutput: `Action executed: ${b.label}`,
          simulationState: { ...parentSimState, action: b.label, vars: { ...vars } }
        });
      } else if (b.type === 'loop') {
        const iters = b.iterations || 3;
        for (let i = 1; i <= iters; i++) {
          vars['cycle'] = i;
          steps.push({
            blockId: b.id,
            stepNumber: stepNum++,
            label: `${b.label} (Cycle ${i}/${iters})`,
            codeSnippet: `for cycle in range(1, ${iters + 1}): # Iteration ${i}`,
            variables: { ...vars },
            logOutput: `Loop cycle ${i} of ${iters} active...`,
            simulationState: { ...parentSimState, cycle: i, totalCycles: iters }
          });
          if (b.children) {
            traverse(b.children, { ...parentSimState, cycle: i });
          }
        }
      } else if (b.type === 'end') {
        steps.push({
          blockId: b.id,
          stepNumber: stepNum++,
          label: b.label,
          codeSnippet: `print("${b.label}")`,
          variables: { ...vars },
          logOutput: `HALT: System cycle finished cleanly.`,
          simulationState: { ...parentSimState, status: 'COMPLETED' }
        });
      }
    }
  };

  traverse(project.blocks, { status: 'READY' });
  return steps;
}

// ==========================================
// RENDERERS: LIVE SIMULATION STAGES
// ==========================================

function renderLiveSimulationStage(type: SystemSimulationType, simState: any, currentStep?: ExecutionStep) {
  const vars = currentStep?.variables || {};

  if (type === 'security-gate') {
    const isBarrierOpen = vars.barrier === 'OPEN';
    const isRedAlert = vars.alarm === 'RED_ALERT';
    const isLocked = vars.barrier === 'LOCKED';

    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-4 relative">
        {/* Sky / Gate Environment */}
        <div className="w-full max-w-md h-40 bg-stone-900/90 rounded-2xl border border-stone-800 relative flex items-end justify-between px-10 pb-4 overflow-hidden">
          {/* Status Indicator Beacon */}
          <div className="absolute top-4 left-6 flex items-center gap-2">
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                isRedAlert
                  ? 'bg-red-500 animate-ping'
                  : isBarrierOpen
                  ? 'bg-emerald-500 animate-pulse'
                  : isLocked
                  ? 'bg-amber-500'
                  : 'bg-stone-600'
              }`}
            />
            <span className="text-[11px] font-mono text-stone-300 font-bold">
              {isRedAlert ? 'EMERGENCY OVERRIDE' : isBarrierOpen ? 'ACCESS GRANTED' : isLocked ? 'ACCESS DENIED' : 'SCANNING VEHICLE'}
            </span>
          </div>

          {/* Vehicle Pillar */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-10 bg-blue-600/80 rounded-t-xl border border-blue-400/50 flex items-center justify-center shadow-md">
              <span className="text-[10px] text-white font-mono font-bold">{vars.vehicleWeight || 3}T</span>
            </div>
            <div className="w-20 h-4 bg-stone-700 rounded-b flex justify-around items-center px-1">
              <div className="w-3 h-3 bg-stone-900 rounded-full" />
              <div className="w-3 h-3 bg-stone-900 rounded-full" />
            </div>
            <span className="text-[10px] font-mono text-stone-400 mt-1">Vehicle</span>
          </div>

          {/* Barrier Gate Arm */}
          <div className="flex flex-col items-center relative">
            {/* Barrier Arm with animated rotation */}
            <div
              className="w-28 h-3.5 bg-gradient-to-r from-red-600 via-white to-red-600 rounded-full shadow-lg border border-red-500 absolute -top-10 left-3 origin-left transition-all duration-700"
              style={{
                transform: isBarrierOpen ? 'rotate(-65deg)' : 'rotate(0deg)'
              }}
            />
            {/* Motor Post */}
            <div className="w-6 h-16 bg-stone-800 rounded-t border-t-2 border-stone-500 flex flex-col items-center justify-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            </div>
            <span className="text-[10px] font-mono text-stone-400 mt-1">Barrier Arm</span>
          </div>
        </div>

        {/* Live Status Banner */}
        <div className="mt-3 flex items-center gap-2 text-xs font-mono">
          <span className="text-stone-400">Barrier State:</span>
          <span
            className={`font-bold px-2 py-0.5 rounded ${
              isBarrierOpen ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
            }`}
          >
            {vars.barrier || 'SCANNING'}
          </span>
        </div>
      </div>
    );
  }

  if (type === 'smart-thermostat') {
    const temp = vars.roomTemp ?? 28;
    const acPower = vars.ac_power || 'OFF';
    const fanSpeed = vars.fan_speed ?? 0;

    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-4">
        {/* Thermostat Dial */}
        <div className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-stone-900 to-black border-4 border-stone-800 flex flex-col items-center justify-center shadow-2xl">
          <div
            className={`absolute inset-0 rounded-full transition-all duration-500 ${
              acPower === 'COOLING'
                ? 'border-4 border-blue-500/70 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                : acPower === 'ECO_STANDBY'
                ? 'border-4 border-amber-500/60'
                : 'border-4 border-emerald-500/50'
            }`}
          />
          <span className="text-3xl font-bold font-mono text-stone-100">{temp}°C</span>
          <span className="text-[10px] font-mono text-stone-400 uppercase mt-1">
            {acPower}
          </span>
        </div>

        {/* Fan Status */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-900 rounded-full border border-stone-800">
            <span className="text-xs text-stone-400">Fan Speed:</span>
            <span className="text-xs font-mono font-bold text-red-400">{fanSpeed}x</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-900 rounded-full border border-stone-800">
            <span className="text-xs text-stone-400">Target:</span>
            <span className="text-xs font-mono font-bold text-emerald-400">{vars.targetTemp ?? 22}°C</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'warehouse-rover') {
    const cycle = simState.cycle ?? vars.delivered ?? 0;
    const total = simState.totalCycles ?? vars.cargoUnits ?? 4;
    const battery = vars.batteryLevel ?? 85;
    const isDocking = vars.rover_status === 'DOCKING';

    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-4">
        {/* Warehouse Grid Track */}
        <div className="w-full max-w-lg h-32 bg-stone-900/80 rounded-2xl border border-stone-800 relative flex items-center justify-between px-6 overflow-hidden">
          {/* Waypoints */}
          {[1, 2, 3, 4, 5].map(pt => (
            <div key={pt} className="flex flex-col items-center z-0">
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  cycle >= pt ? 'bg-emerald-500 border-emerald-300' : 'bg-stone-800 border-stone-600'
                }`}
              />
              <span className="text-[9px] font-mono text-stone-500 mt-1">WP-{pt}</span>
            </div>
          ))}

          {/* Autonomous AGV Rover Cart */}
          <div
            className="absolute top-10 w-14 h-10 bg-red-600/90 rounded-lg border border-red-400 shadow-xl flex flex-col items-center justify-center z-10 transition-all duration-700"
            style={{
              left: isDocking ? '5%' : `${Math.min(15 + cycle * 18, 80)}%`
            }}
          >
            <span className="text-[9px] font-mono font-bold text-white">AGV-01</span>
            <div className="w-2 h-1 bg-yellow-300 rounded-full animate-ping mt-1" />
          </div>
        </div>

        {/* Telemetry info */}
        <div className="mt-3 flex items-center gap-4 text-xs font-mono">
          <span className="text-stone-400">
            Pallets Delivered: <span className="text-emerald-400 font-bold">{cycle} / {total}</span>
          </span>
          <span className="text-stone-400">
            Battery: <span className="text-amber-400 font-bold">{battery}%</span>
          </span>
          <span className="text-stone-400">
            Status: <span className="text-red-400 font-bold">{vars.rover_status || 'TRANSIT'}</span>
          </span>
        </div>
      </div>
    );
  }

  // Default: traffic-light
  const light = vars.light || 'RED';
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      <div className="w-20 h-44 bg-black/90 rounded-2xl border-2 border-stone-700 flex flex-col items-center justify-around py-3 shadow-2xl">
        <div
          className={`w-9 h-9 rounded-full transition-all duration-300 ${
            light === 'RED'
              ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]'
              : 'bg-red-950/40 border border-red-900/30'
          }`}
        />
        <div
          className={`w-9 h-9 rounded-full transition-all duration-300 ${
            light === 'YELLOW'
              ? 'bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)]'
              : 'bg-amber-950/40 border border-amber-900/30'
          }`}
        />
        <div
          className={`w-9 h-9 rounded-full transition-all duration-300 ${
            light === 'GREEN' || light === 'GREEN_CORRIDOR'
              ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]'
              : 'bg-emerald-950/40 border border-emerald-900/30'
          }`}
        />
      </div>

      <div className="mt-3 text-xs font-mono text-stone-300">
        Current Phase: <span className="text-red-400 font-bold">{light}</span>
        {vars.duration && <span className="ml-2 text-stone-500">({vars.duration}s timer)</span>}
      </div>
    </div>
  );
}

// ==========================================
// RENDERERS: DYNAMIC SVG FLOWCHART
// ==========================================

function renderFlowchartSvg(blocks: LogicBlock[], activeBlockId?: string, isFull = false) {
  const nodeWidth = 180;
  const nodeHeight = 44;
  const gapY = 56;
  const startX = isFull ? 240 : 130;
  let currentY = 24;

  const renderedNodes: any[] = [];
  const connectors: any[] = [];

  const addNode = (block: LogicBlock, x: number, y: number) => {
    renderedNodes.push({
      ...block,
      x,
      y
    });
  };

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    addNode(b, startX, currentY);

    // If condition has branch children, render branch cards
    if (b.type === 'condition' && ((b.children && b.children.length > 0) || (b.elseChildren && b.elseChildren.length > 0))) {
      const branchY = currentY + nodeHeight + 25;
      
      // True branch
      if (b.children && b.children.length > 0) {
        const trueX = Math.max(20, startX - 110);
        const childBlock = b.children[0];
        addNode(childBlock, trueX, branchY);
        connectors.push({
          x1: startX + 30,
          y1: currentY + nodeHeight,
          x2: trueX + nodeWidth / 2,
          y2: branchY,
          label: 'True'
        });
      }

      // False / Else branch
      if (b.elseChildren && b.elseChildren.length > 0) {
        const falseX = startX + 110;
        const elseBlock = b.elseChildren[0];
        addNode(elseBlock, falseX, branchY);
        connectors.push({
          x1: startX + nodeWidth - 30,
          y1: currentY + nodeHeight,
          x2: falseX + nodeWidth / 2,
          y2: branchY,
          label: 'False'
        });
      }

      currentY = branchY + nodeHeight + 20;
    } else if (i < blocks.length - 1) {
      connectors.push({
        x1: startX + nodeWidth / 2,
        y1: currentY + nodeHeight,
        x2: startX + nodeWidth / 2,
        y2: currentY + nodeHeight + gapY - 10
      });
      currentY += nodeHeight + gapY;
    } else {
      currentY += nodeHeight + gapY;
    }
  }

  const svgHeight = Math.max(currentY + 40, isFull ? 500 : 360);
  const svgWidth = isFull ? 640 : 420;

  return (
    <svg width={svgWidth} height={svgHeight} className="overflow-visible">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#78716c" />
        </marker>
        <marker id="arrow-active" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
        </marker>
      </defs>

      {/* Connectors */}
      {connectors.map((c, i) => (
        <g key={i}>
          <line
            x1={c.x1}
            y1={c.y1}
            x2={c.x2}
            y2={c.y2}
            stroke="#44403c"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          {c.label && (
            <text
              x={(c.x1 + c.x2) / 2 + (c.label === 'True' ? -18 : 6)}
              y={(c.y1 + c.y2) / 2}
              className={`text-[9px] font-mono font-bold select-none ${c.label === 'True' ? 'fill-emerald-400' : 'fill-red-400'}`}
            >
              {c.label}
            </text>
          )}
        </g>
      ))}

      {/* Nodes */}
      {renderedNodes.map(node => {
        const isActive = node.id === activeBlockId;
        const isStartEnd = node.type === 'start' || node.type === 'end';
        const isCond = node.type === 'condition';

        return (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            {/* Node Box */}
            <rect
              width={nodeWidth}
              height={nodeHeight}
              rx={isStartEnd ? 22 : isCond ? 8 : 10}
              className={`transition-all duration-300 ${
                isActive
                  ? 'fill-red-950/80 stroke-red-500 stroke-2 filter drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                  : isStartEnd
                  ? 'fill-stone-900 stroke-purple-600/70 stroke-1'
                  : isCond
                  ? 'fill-stone-900 stroke-amber-500/70 stroke-1'
                  : 'fill-stone-900 stroke-blue-500/70 stroke-1'
              }`}
            />
            {/* Label */}
            <text
              x={nodeWidth / 2}
              y={nodeHeight / 2 + 4}
              textAnchor="middle"
              className={`text-[11px] font-mono select-none ${
                isActive ? 'fill-red-200 font-bold' : 'fill-stone-200'
              }`}
            >
              {node.label.length > 20 ? node.label.substring(0, 18) + '...' : node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
