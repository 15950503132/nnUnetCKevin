import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Database, 
  Play, 
  Settings, 
  FileText, 
  ChevronRight, 
  Plus, 
  Terminal, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  Upload,
  Download,
  BrainCircuit,
  Layers,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Project {
  id: string;
  name: string;
  status: 'idle' | 'training' | 'completed' | 'error';
  progress: number;
  epoch: number;
  maxEpoch: number;
  dice: number;
  lastUpdated: string;
  dataset: {
    train: number;
    val: number;
    test: number;
  };
}

const App = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'dataset' | 'training' | 'inference'>('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
      if (data.length > 0 && !selectedProject) {
        setSelectedProject(data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  };

  const createProject = async () => {
    if (!newProjectName) return;
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName })
      });
      const data = await res.json();
      setProjects([...projects, data]);
      setIsCreating(false);
      setNewProjectName('');
      setSelectedProject(data);
    } catch (err) {
      console.error('Failed to create project', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'training': return 'text-blue-400';
      case 'completed': return 'text-emerald-400';
      case 'error': return 'text-rose-400';
      default: return 'text-zinc-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-zinc-300 font-sans selection:bg-zinc-700">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 border-r border-zinc-800 bg-[#0A0A0A] z-50">
        <div className="p-6 flex items-center gap-3 border-b border-zinc-800">
          <div className="w-8 h-8 bg-zinc-100 rounded flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-zinc-900" />
          </div>
          <span className="font-mono font-bold text-zinc-100 tracking-tighter text-lg">SPINESEG AI</span>
        </div>

        <nav className="p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded transition-colors ${activeTab === 'dashboard' ? 'bg-zinc-800 text-zinc-100' : 'hover:bg-zinc-900'}`}
          >
            <Activity className="w-4 h-4" />
            <span className="text-sm font-medium">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('dataset')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded transition-colors ${activeTab === 'dataset' ? 'bg-zinc-800 text-zinc-100' : 'hover:bg-zinc-900'}`}
          >
            <Database className="w-4 h-4" />
            <span className="text-sm font-medium">Dataset</span>
          </button>
          <button 
            onClick={() => setActiveTab('training')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded transition-colors ${activeTab === 'training' ? 'bg-zinc-800 text-zinc-100' : 'hover:bg-zinc-900'}`}
          >
            <Play className="w-4 h-4" />
            <span className="text-sm font-medium">Training</span>
          </button>
          <button 
            onClick={() => setActiveTab('inference')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded transition-colors ${activeTab === 'inference' ? 'bg-zinc-800 text-zinc-100' : 'hover:bg-zinc-900'}`}
          >
            <Search className="w-4 h-4" />
            <span className="text-sm font-medium">Inference</span>
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold">JD</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-zinc-100 truncate">John Doe</p>
              <p className="text-[10px] text-zinc-500 truncate">Radiologist</p>
            </div>
            <Settings className="w-4 h-4 text-zinc-500 cursor-pointer hover:text-zinc-300" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-serif italic text-zinc-100 mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p className="text-zinc-500 text-sm font-mono uppercase tracking-widest">
              nnU-Net Spine Segmentation Manager
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 bg-zinc-100 text-zinc-900 px-4 py-2 rounded font-bold text-sm hover:bg-zinc-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6">
              {[
                { label: 'Total Projects', value: projects.length, icon: Layers },
                { label: 'Avg Dice Score', value: '0.84', icon: BarChart3 },
                { label: 'GPUs Active', value: '2/4', icon: Activity },
                { label: 'Total Images', value: '1,240', icon: Database },
              ].map((stat, i) => (
                <div key={i} className="bg-[#1A1A1A] border border-zinc-800 p-6 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <stat.icon className="w-5 h-5 text-zinc-500" />
                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-tighter">Live</span>
                  </div>
                  <p className="text-3xl font-mono text-zinc-100 mb-1">{stat.value}</p>
                  <p className="text-[11px] font-serif italic text-zinc-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Projects Table */}
            <div className="bg-[#1A1A1A] border border-zinc-800 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="text-sm font-bold text-zinc-100">Active Projects</h3>
                <span className="text-[10px] font-mono text-zinc-500">SORT BY: RECENT</span>
              </div>
              <div className="divide-y divide-zinc-800">
                {projects.map((project) => (
                  <div 
                    key={project.id} 
                    onClick={() => setSelectedProject(project)}
                    className={`group flex items-center p-4 hover:bg-zinc-900 transition-colors cursor-pointer ${selectedProject?.id === project.id ? 'bg-zinc-900' : ''}`}
                  >
                    <div className="w-10 h-10 bg-zinc-800 rounded flex items-center justify-center mr-4">
                      <FileText className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-zinc-100">{project.name}</h4>
                      <p className="text-[11px] text-zinc-500 font-mono">{project.id}</p>
                    </div>
                    <div className="flex items-center gap-8 mr-8">
                      <div className="text-right">
                        <p className={`text-[11px] font-mono uppercase tracking-widest ${getStatusColor(project.status)}`}>
                          {project.status}
                        </p>
                        <p className="text-[10px] text-zinc-600">STATUS</p>
                      </div>
                      <div className="text-right w-24">
                        <p className="text-[11px] font-mono text-zinc-100">
                          {project.dice.toFixed(3)}
                        </p>
                        <p className="text-[10px] text-zinc-600">DICE SCORE</p>
                      </div>
                      <div className="text-right w-32">
                        <div className="w-full bg-zinc-800 h-1 rounded-full mb-1">
                          <div 
                            className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-zinc-600 font-mono uppercase">Progress: {project.progress}%</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dataset' && (
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-6">
              <div className="bg-[#1A1A1A] border border-zinc-800 p-8 rounded-lg text-center border-dashed">
                <Upload className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <h3 className="text-lg font-serif italic text-zinc-100 mb-2">Upload NIfTI Data</h3>
                <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto">
                  Drag and drop your .nii.gz files here. Ensure they follow the nnU-Net naming convention (e.g., Spine_001_0000.nii.gz).
                </p>
                <button className="bg-zinc-800 text-zinc-100 px-6 py-2 rounded font-bold text-sm hover:bg-zinc-700 transition-colors">
                  Browse Files
                </button>
              </div>

              <div className="bg-[#1A1A1A] border border-zinc-800 rounded-lg">
                <div className="p-4 border-b border-zinc-800">
                  <h3 className="text-sm font-bold text-zinc-100">Dataset Inventory</h3>
                </div>
                <div className="p-4">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest border-b border-zinc-800">
                        <th className="pb-4">Case ID</th>
                        <th className="pb-4">Modality</th>
                        <th className="pb-4">Resolution</th>
                        <th className="pb-4">Labels</th>
                        <th className="pb-4">Size</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {[
                        { id: 'Spine_001', mod: 'CT', res: '0.8x0.8x1.0', labels: 'L1-L5', size: '45MB' },
                        { id: 'Spine_002', mod: 'CT', res: '0.7x0.7x1.0', labels: 'T12-L5', size: '42MB' },
                        { id: 'Spine_003', mod: 'CT', res: '0.9x0.9x1.2', labels: 'L1-S1', size: '38MB' },
                      ].map((item, i) => (
                        <tr key={i} className="hover:bg-zinc-900/50 transition-colors">
                          <td className="py-4 font-mono text-zinc-100">{item.id}</td>
                          <td className="py-4 text-zinc-400">{item.mod}</td>
                          <td className="py-4 text-zinc-400">{item.res}</td>
                          <td className="py-4 text-zinc-400">{item.labels}</td>
                          <td className="py-4 text-zinc-500 font-mono text-xs">{item.size}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#1A1A1A] border border-zinc-800 p-6 rounded-lg">
                <h3 className="text-sm font-bold text-zinc-100 mb-4">Dataset Distribution</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-1">
                      <span>TRAINING</span>
                      <span>80%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[80%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-1">
                      <span>VALIDATION</span>
                      <span>15%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-[15%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-1">
                      <span>TESTING</span>
                      <span>5%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-zinc-600 h-full w-[5%]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#1A1A1A] border border-zinc-800 p-6 rounded-lg">
                <h3 className="text-sm font-bold text-zinc-100 mb-4">nnU-Net dataset.json</h3>
                <pre className="text-[10px] font-mono text-zinc-500 bg-black/30 p-4 rounded overflow-x-auto">
{`{
  "name": "SpineSegmentation",
  "description": "CT Spine Seg",
  "labels": {
    "0": "background",
    "1": "vertebra"
  },
  "numTraining": 40,
  "file_ending": ".nii.gz"
}`}
                </pre>
                <button className="w-full mt-4 flex items-center justify-center gap-2 border border-zinc-700 py-2 rounded text-xs font-bold hover:bg-zinc-800 transition-colors">
                  <Download className="w-3 h-3" />
                  Export JSON
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'training' && (
          <div className="grid grid-cols-4 gap-8">
            <div className="col-span-3 space-y-6">
              <div className="bg-[#1A1A1A] border border-zinc-800 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-zinc-500" />
                    <h3 className="text-sm font-bold text-zinc-100">Training Logs</h3>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-mono rounded">EPOCH 120/1000</span>
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono rounded">DICE: 0.824</span>
                  </div>
                </div>
                <div className="bg-black/50 p-6 rounded font-mono text-[11px] text-zinc-400 h-96 overflow-y-auto space-y-1">
                  <p className="text-zinc-600">[2026-03-20 07:12:45] Starting Epoch 120...</p>
                  <p className="text-zinc-400 font-bold">Executing: python nnunet_scripts/train.py --dataset 501 --fold 0</p>
                  <p>Training loss: 0.142 | Validation loss: 0.158</p>
                  <p>Dice Score (Vertebra): 0.824</p>
                  <p className="text-zinc-600">[2026-03-20 07:13:12] Epoch 120 finished in 27.4s</p>
                  <p className="text-zinc-600">[2026-03-20 07:13:12] Saving checkpoint to model_best.pth...</p>
                  <p className="text-zinc-600">[2026-03-20 07:13:15] Starting Epoch 121...</p>
                  <div className="animate-pulse inline-block w-2 h-4 bg-zinc-700 ml-1" />
                </div>
              </div>

              <div className="bg-[#1A1A1A] border border-zinc-800 p-6 rounded-lg">
                <h3 className="text-sm font-bold text-zinc-100 mb-6">Loss Curve</h3>
                <div className="h-64 flex items-end gap-1">
                  {Array.from({ length: 60 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="bg-blue-500/40 hover:bg-blue-500 transition-colors flex-1" 
                      style={{ height: `${Math.max(20, 100 - i * 1.2 + Math.random() * 10)}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-mono text-zinc-600">
                  <span>EPOCH 0</span>
                  <span>EPOCH 120</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#1A1A1A] border border-zinc-800 p-6 rounded-lg">
                <h3 className="text-sm font-bold text-zinc-100 mb-4">Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Network Architecture</label>
                    <select className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-300">
                      <option>3d_fullres</option>
                      <option>3d_lowres</option>
                      <option>2d</option>
                      <option>3d_cascade_fullres</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Batch Size</label>
                    <input type="number" defaultValue={2} className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-300" />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Learning Rate</label>
                    <input type="text" defaultValue="0.01" className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-300" />
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 rounded font-bold text-sm hover:bg-blue-700 transition-colors mt-4">
                    Update Params
                  </button>
                  <button className="w-full border border-rose-900/50 text-rose-500 py-2 rounded font-bold text-sm hover:bg-rose-900/20 transition-colors">
                    Stop Training
                  </button>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-sm font-bold text-emerald-500">Model Ready</h3>
                </div>
                <p className="text-xs text-emerald-500/70 mb-4">
                  Best checkpoint saved with Dice 0.824. Ready for inference.
                </p>
                <button className="w-full bg-emerald-600 text-white py-2 rounded font-bold text-sm hover:bg-emerald-700 transition-colors">
                  Download .pth
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inference' && (
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-[#1A1A1A] border border-zinc-800 p-8 rounded-lg text-center border-dashed">
                <Upload className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <h3 className="text-lg font-serif italic text-zinc-100 mb-2">Upload Scan for Inference</h3>
                <p className="text-zinc-500 text-sm mb-6">
                  Select a NIfTI CT scan to perform spine segmentation using the trained model.
                </p>
                <button className="bg-zinc-100 text-zinc-900 px-6 py-2 rounded font-bold text-sm hover:bg-zinc-200 transition-colors">
                  Select Scan
                </button>
              </div>

              <div className="bg-[#1A1A1A] border border-zinc-800 p-6 rounded-lg">
                <h3 className="text-sm font-bold text-zinc-100 mb-4">Inference Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Test Time Augmentation (TTA)</span>
                    <div className="w-8 h-4 bg-zinc-800 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-2 h-2 bg-zinc-500 rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Post-processing (Connected Components)</span>
                    <div className="w-8 h-4 bg-blue-500 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-zinc-800 rounded-lg overflow-hidden flex flex-col">
              <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="text-sm font-bold text-zinc-100">Segmentation Preview</h3>
                <div className="flex gap-2">
                  <button className="text-[10px] font-mono px-2 py-1 bg-zinc-800 rounded">AXIAL</button>
                  <button className="text-[10px] font-mono px-2 py-1 bg-zinc-900 rounded">SAGITTAL</button>
                  <button className="text-[10px] font-mono px-2 py-1 bg-zinc-900 rounded">CORONAL</button>
                </div>
              </div>
              <div className="flex-1 bg-black flex items-center justify-center relative group">
                <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/seed/spine/800/800')] bg-cover bg-center grayscale" />
                <div className="relative z-10 text-center">
                  <div className="w-64 h-64 border-2 border-blue-500/30 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                    <div className="w-48 h-48 border-2 border-emerald-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                  </div>
                  <p className="mt-8 text-xs font-mono text-zinc-500 uppercase tracking-[0.2em]">Waiting for input...</p>
                </div>
                
                {/* Simulated segmentation overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-32 h-64 bg-emerald-500/20 blur-xl rounded-full rotate-12" />
                </div>
              </div>
              <div className="p-4 bg-zinc-900/50 border-t border-zinc-800">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span className="text-[10px] font-mono text-zinc-400">VERTEBRA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-[10px] font-mono text-zinc-400">SPINAL CANAL</span>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-xs font-bold text-zinc-100 hover:text-white">
                    <Download className="w-3 h-3" />
                    Export Segmentation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreating(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#1A1A1A] border border-zinc-800 rounded-xl p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-serif italic text-zinc-100 mb-6">Initialize New Project</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Project Name</label>
                  <input 
                    autoFocus
                    type="text" 
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="e.g. Spine_Seg_Lumbosacral"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Task ID</label>
                  <input 
                    type="text" 
                    defaultValue="Task501"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600 transition-colors"
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    onClick={() => setIsCreating(false)}
                    className="flex-1 px-4 py-2 rounded font-bold text-sm border border-zinc-800 text-zinc-400 hover:bg-zinc-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={createProject}
                    className="flex-1 px-4 py-2 rounded font-bold text-sm bg-zinc-100 text-zinc-900 hover:bg-zinc-200 transition-colors"
                  >
                    Create Project
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
