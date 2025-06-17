import React, { useState } from 'react';
import { Button } from '../../../../../components/ui/button';
import ForceGraph2D, { LinkObject, NodeObject } from 'react-force-graph-2d';
import {
  ArrowLeftIcon,
  ShareIcon,
  PrinterIcon,
  MoreHorizontalIcon,
  SearchIcon,
  PlayIcon,
  ExternalLinkIcon,
  MapIcon,
  GlobeIcon,
  FolderIcon
} from 'lucide-react';

interface DeepLearnResponseProps {
  onBack: () => void;
  isSplit?: boolean;
}

interface CustomNode extends NodeObject {
  id: string;
  x?: number;
  y?: number;
  color?: string;
  __bckgDimensions?: [number, number];
}

const myData: { nodes: CustomNode[]; links: LinkObject[] } = {
  nodes: [
    { id: 'Black Hole' },
    { id: 'White dwarf' },
    { id: 'Type I Supernova' },
    { id: 'Gravity Wave' },
    { id: 'Stretched Horizon' },
    { id: 'Cosmology' },
  ],
  links: [
    { source: 'Black Hole', target: 'White dwarf' },
    { source: 'Black Hole', target: 'Type I Supernova' },
    { source: 'Type I Supernova', target: 'White dwarf' },
    { source: 'Type I Supernova', target: 'Gravity Wave' },
    { source: 'Black Hole', target: 'Stretched Horizon' },
    { source: 'Black Hole', target: 'Cosmology' },
  ],
};

function DeepLearnResponse({ onBack, isSplit = false }: DeepLearnResponseProps) {
  const [selectedMode, setSelectedMode] = useState<'deep-learn' | 'quick-search'>('deep-learn');
  const [selectedTopic, setSelectedTopic] = useState('New Topic');
  const [hoverNode, setHoverNode] = useState<CustomNode | null>(null);

  return (
    <div className={`${isSplit ? 'h-[calc(100vh-183px)]' : 'h-[calc(100vh-183px)]'} flex flex-col bg-white`}>
      {/* Header - No border */}
      <div className="flex items-center justify-between p-4 bg-white">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
          <h1 className="font-medium text-base text-black font-['Inter',Helvetica]">
            Learning Journey: Exploration of Black Hole and its Related Concepts
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button className="bg-[#6B94E4] hover:bg-[#5a82d1] text-white rounded-lg px-4 py-2 flex items-center gap-2 font-['Inter',Helvetica] text-sm">
            Publish to Community
            <ShareIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="p-2"
          >
            <ShareIcon className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="p-2"
          >
            <PrinterIcon className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="p-2"
          >
            <MoreHorizontalIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-y-auto">
        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="max-w-3xl mx-auto px-8">
            {/* User Question - Following DocumentChatResponse style */}
            <div className="flex flex-col items-end mb-6">
              <span className="text-xs text-gray-500 font-['Inter',Helvetica] mb-2">
                Me, Jun 1, 9:50 PM
              </span>
              <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                <p className="text-sm text-black font-['Inter',Helvetica]">
                  黑洞信息悖论如何解决？
                </p>
              </div>
            </div>

            {/* AI Response */}
            <div className="prose max-w-none font-['Inter',Helvetica] text-sm leading-relaxed">
              {/* Question with Deep Learn tag - aligned horizontally */}
              <div className="flex items-center gap-3 ">
                <h2 className="text-lg font-medium text-black m-2">黑洞信息悖论如何解决？</h2>
                <span className="flex items-center bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">Deep Learn</span>
              </div>

              {/* Gray line separator */}
              <div className="w-full h-px bg-gray-300 mb-6"></div>

              {/* Five placeholder boxes */}
              <div className="grid grid-cols-5 gap-4 mb-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-full h-20 bg-gray-100 rounded-lg border border-gray-200"></div>
                ))}
              </div>

              {/* Main content */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-base mb-3">1. 黑洞信息悖论的由来</h3>
                  <p className="mb-4">
                    黑洞信息悖论（Black Hole Information Paradox）源于量子力学与广义相对论在黑洞物理中的冲突。根据广义相对论，黑洞是一个引力极强、任何物质和辐射都无法逃逸的时空区域。1970年代，霍金（Stephen Hawking）将量子场论应用于黑洞附近，发现黑洞会通过量子效应向外辐射能量，这被称为"霍金辐射"。
                  </p>
                  <p className="mb-4">
                    霍金的计算表明，霍金辐射的性质仅与黑洞的总质量、电荷和角动量有关，而与黑洞形成时的初始状态（即落入黑洞的物质信息）无关。这意味着，多个不同的初始状态可以演化成相同的最终状态，而这些初始状态的详细信息会在黑洞蒸发过程中"丢失"，这与量子力学中的"信息守恒"原理（即系统的波函数演化是幺正的，信息不会无故消失）相矛盾。
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-base mb-3">2. 悖论的核心矛盾</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong>量子决定性</strong>：给定量子系统的当前状态，未来状态可以被唯一确定；反之亦然。</li>
                    <li><strong>可逆性</strong>：量子力学演化是幺正的，即信息不会被破坏或丢失。</li>
                    <li><strong>霍金辐射的"无信息"</strong>：霍金辐射看似不携带黑洞内部的信息，信息似乎永久丢失。</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-base mb-3">解决思路与主要理论</h3>

                  <h4 className="font-medium text-sm mb-2">2.1 全息原理与AdS/CFT对偶</h4>
                  <p className="mb-4">
                    全息原理（Holographic Principle）认为，描述一个空间区域的所有物理信息，可以被编码在该区域的边界上（如黑洞的事件视界）。AdS/CFT对偶是这一原理的数学实现，它指出，一个五维反德西特时空（AdS）中的量子引力理论，等价于其四维边界上的共形场论（CFT）。在这种框架下，黑洞内部的信息可以被"映射"到边界上，从而避免信息丢失。
                  </p>
                  <p className="mb-4">
                    全息原理的提出，解决了黑洞信息悖论的部分难题，并提供了新的理论工具。它表明，信息实际上并未丢失，而是以某种方式被"编码"在黑洞边界或外部宇宙中。
                  </p>

                  <h4 className="font-medium text-sm mb-2">2.2 佩奇曲线与量子纠缠</h4>
                  <p className="mb-4">
                    佩奇（Don Page）提出，如果黑洞与外界之间的纠缠随时间变化遵循"佩奇曲线"，则说明信息会从黑洞中释放出来。这条曲线早期随辐射增加而上升，达到峰值（佩奇时间）后下降，最终归零，意味着信息被完整保留。
                  </p>
                  <p className="mb-4">
                    近年来，物理学家通过弦论、全息原理等方法，证明了黑洞的纠缠确实遵循佩奇曲线，信息会随着霍金辐射逐渐释放出来。
                  </p>

                  <h4 className="font-medium text-sm mb-2">2.3 ER=EPR假想</h4>
                  <p className="mb-4">
                    ER=EPR假想将爱因斯坦-罗森桥（ER，即虫洞）与量子纠缠（EPR，爱因斯坦-波多尔斯基-罗森悖论）联系起来，认为黑洞内部和外部的粒子通过虫洞连接，形成量子纠缠。这样，落入黑洞的信息会被保存在外部粒子中，并通过虫洞与内部粒子保持联系，从而避免了信息的丢失或复制。
                  </p>
                  <p className="mb-4">
                    这一假想为信息如何在黑洞内外传递提供了新的视角，但目前尚未被实验证实。
                  </p>

                  <h4 className="font-medium text-sm mb-2">4. 信息量子热力学</h4>
                  <p className="mb-4">
                    有理论提出，信息本身不是先天固有的，而是后天生成的，物质与信息相互关联。落入黑洞的物质信息会转化为热辐射、热熵等量子态，通过量子信息科学和经典热力学的结合，信息得以
                  </p>
                  <div className='w-full h-[15px]'></div>

                </div>

              </div>

              {/* Bottom Input Box */}
              <div className={`fixed bottom-6 ${isSplit ? 'w-[calc(50%-100px)]' : 'w-full max-w-3xl'} mx-auto bg-white border border-gray-300 rounded-2xl px-4 py-2 shadow-sm h-[120px] text-[12px] flex flex-col justify-between`}>
                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700 font-['Inter',Helvetica] text-[12px]">Start a</span>
                    <button className="bg-[#F9F9F9] border border-[#D9D9D9] text-[#4A4A4A] rounded-xl px-2 py-0.5 font-['Inter',Helvetica] text-[12px] hover:bg-gray-100">
                      Follow Up
                    </button>
                    <span className="text-gray-500 font-['Inter',Helvetica] text-[12px]">or</span>
                    <button className="bg-[#F9F9F9] border border-[#D9D9D9] text-[#4A4A4A] rounded-xl px-2 py-0.5 font-['Inter',Helvetica] text-[12px] hover:bg-gray-100">
                      New Topic
                    </button>
                  </div>
                </div>

                <div className="space-y-0">
                  <div className="text-sm text-gray-600 font-['Inter',Helvetica]">
                    Note: If already selected
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 font-['Inter',Helvetica]">Change to</span>
                      <button className="bg-[#F9F9F9] border border-[#D9D9D9] text-[#4A4A4A] rounded-xl px-2 py-0.5 text-[12px] font-['Inter',Helvetica] hover:bg-gray-100">
                        New Topic
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <GlobeIcon className="w-4 h-4 text-gray-500" />

                      {/* Deep Learn / Quick Search Toggle */}
                      <div
                        className="w-[180px] h-[30px] bg-[#ECF1F6] rounded-[16.5px] flex items-center cursor-pointer relative"
                        onClick={() => setSelectedMode(selectedMode === 'deep-learn' ? 'quick-search' : 'deep-learn')}
                      >
                        <div
                          className={`absolute top-1 w-[84px] h-[22px] bg-white rounded-[14px] transition-all duration-300 ease-in-out z-10 ${selectedMode === 'deep-learn' ? 'left-1.5' : 'left-[94px]'
                            }`}
                        />
                        <div className="absolute left-4 h-full flex items-center z-20">
                          <span className="text-[#6B6B6B] font-['Inter',Helvetica] text-xs font-medium">Deep Learn</span>
                        </div>
                        <div className="absolute right-3 h-full flex items-center z-20">
                          <span className="text-[#6B6B6B] font-['Inter',Helvetica] text-xs font-medium">Quick Search</span>
                        </div>
                      </div>

                      <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-600">
                        <FolderIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${isSplit ? 'w-[220px]' : 'w-[320px]'} grid grid-rows-5  ${isSplit ? 'h-[calc(100vh-315px)]' : 'h-[calc(100vh-255px)]'} mr-[100px] gap-4`}>
          {/* Fixed Right Sidebar - Related Contents */}
          <div className='border-solid border-[#4980ff38] border rounded-lg flex flex-col row-span-3'>
            {/* Fixed Blue Header Section */}
            <div className="bg-[#E8F0FF] p-4 rounded-t-lg flex-shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <SearchIcon className="w-4 h-4 text-[#4A90E2]" />
                <h3 className="font-semibold text-sm text-black">Related Contents</h3>
              </div>
              <p className="text-sm text-[#4A90E2]">See more on this topic</p>
            </div>

            {/* Scrollable Content Section */}
            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="bg-white m-4">
                {/* Related Videos */}
                <div className="mb-6">
                  <h4 className="font-medium text-sm text-black mb-3">Related Videos</h4>
                  <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                    <div className="w-full h-32 bg-gradient-to-r from-yellow-400 via-blue-500 to-yellow-400 relative flex items-center justify-center">
                      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                      <div className="text-center z-10">
                        <div className="text-yellow-300 font-bold text-lg mb-1">QUANTUM</div>
                        <div className="flex items-center justify-center mb-1">
                          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-2">
                            <div className="w-4 h-4 bg-black rounded-full"></div>
                          </div>
                          <div className="text-blue-400">⚡ ⚡</div>
                        </div>
                        <div className="text-white font-bold text-lg">ENTANGLEMENT</div>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-black mb-1 font-medium">Quantum Entanglement: Explained in REALLY SIMPLE Words</p>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        <p className="text-xs text-red-600 font-medium">Science ABC</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Related Webpages */}
                <div className="mb-6">
                  <h4 className="font-medium text-sm text-black mb-3">Related Webpages</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#F0F0F0] rounded-lg p-3">
                      <div className="text-xs font-medium text-black mb-2">ScienceDirect discusses quantum entanglement.</div>
                      <div className="text-xs text-gray-600 mb-2">Explore the phenomenon crucial for quantum information processing applications.</div>
                      <div className="text-xs text-black mb-1">Quantum Entanglement - an o...</div>
                      <div className="text-xs text-orange-600">📄 ScienceDirect.com</div>
                    </div>
                    <div className="bg-[#F0F0F0] rounded-lg p-3">
                      <div className="text-xs font-medium text-black mb-2">NASA's take entanglement</div>
                      <div className="text-xs text-gray-600 mb-2">Learn about nature of par common orig</div>
                      <div className="text-xs text-black mb-1">What is Qua</div>
                      <div className="text-xs text-blue-600">🌐 NASA Sc</div>
                    </div>
                  </div>
                </div>

                {/* Related Concepts */}
                <div >
                  <h4 className="font-medium text-sm text-black mb-3">Related Concepts</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-medium text-black mb-2">Understand the fundamental principles of quantum entanglement.</div>
                      <div className="bg-[#D5EBF3] text-[#1e40af] px-2 py-1 rounded text-xs inline-block">
                        Interconnected Fate
                      </div>
                    </div>
                    <div className="bg-[#E8D5F3] text-[#6b21a8] px-2 py-1 rounded text-xs inline-block">
                      Instantaneous Correlation
                    </div>
                    <div className="bg-[#D5F3E8] text-[#059669] px-2 py-1 rounded text-xs inline-block">
                      Randomness
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Right Sidebar - Concept Map */}
          <div className="flex flex-col border border-solid border-[#E2E1E8] w-[320px] row-span-2 bg-[#F0F0F0] rounded-lg overflow-hidden">
            {/* Fixed Header Section */}
            <div className="flex-shrink-0 px-4 pt-3 pb-1 bg-[#F0F0F0]">
              <div className="flex items-center gap-2 mb-2">
                <MapIcon className="w-4 h-4 text-[#4A90E2]" />
                <h3 className="font-semibold text-sm text-black">Concept Map</h3>
              </div>
              <p className="text-sm text-black mb-4">Your Learning Roadmap</p>
            </div>

            {/* Scrollable Content Section */}
            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-0 rounded-0">
              {/* Concept Map Visualization */}
              <div className='w-full  mb-12 bg-white'>
                <ForceGraph2D
                  graphData={myData}
                  width={320}
                  height={200}
                  nodeAutoColorBy="group"
                  onNodeHover={(node: NodeObject | null) => {
                    setHoverNode(node as CustomNode | null);
                  }}
                  nodeCanvasObject={(node: CustomNode, ctx, globalScale) => {
                    const label = node.id;
                    const fontSize = 12 / globalScale;
                    ctx.font = `${fontSize}px Sans-Serif`;

                    const textWidth = ctx.measureText(label).width;
                    const bckgDimensions: [number, number] = [
                      textWidth + fontSize * 0.2,
                      fontSize + fontSize * 0.2,
                    ];
                    const x = node.x ?? 0;
                    const y = node.y ?? 0;

                    if (hoverNode?.id === node.id) {
                      ctx.save();
                      ctx.shadowColor = node.color || '#4f46e5';
                      ctx.shadowBlur = 15;
                      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                      ctx.fillRect(x - bckgDimensions[0] / 2, y - bckgDimensions[1] / 2, ...bckgDimensions);
                      ctx.restore();
                    } else {

                      ctx.fillStyle = 'rgba(255, 255, 255, 0)';
                      ctx.fillRect(x - bckgDimensions[0] / 2, y - bckgDimensions[1] / 2, ...bckgDimensions);
                    }

                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = node.color ?? '#000';
                    ctx.fillText(label, x, y);

                    node.__bckgDimensions = bckgDimensions;
                  }}
                  nodePointerAreaPaint={(node: CustomNode, color, ctx) => {
                    const bckg = node.__bckgDimensions;
                    if (bckg) {
                      ctx.fillStyle = color;
                      ctx.fillRect(
                        (node.x ?? 0) - bckg[0] / 2,
                        (node.y ?? 0) - bckg[1] / 2,
                        ...bckg
                      );
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default DeepLearnResponse;