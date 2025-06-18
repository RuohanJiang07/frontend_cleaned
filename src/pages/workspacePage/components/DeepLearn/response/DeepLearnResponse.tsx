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

// 回答标题区域组件 - 学习参考代码的样式
const AnswerHeader: React.FC<{ title: string; tag: string }> = ({ title, tag }) => (
  <div style={{ marginTop: 18, width: 649, marginLeft: 'auto', marginRight: 'auto' }}>
    <div className="flex items-center" style={{ marginLeft: 0 }}>
      <span
        style={{
          color: '#000',
          fontSize: 13,
          fontWeight: 500,
          fontStyle: 'normal',
          lineHeight: 'normal',
        }}
      >
        {title}
      </span>
      <span
        className="flex items-center justify-center ml-[9px]"
        style={{
          width: 61,
          height: 16,
          flexShrink: 0,
          borderRadius: 8,
          border: '1px solid #D9D9D9',
          background: '#F9F9F9',
          color: '#6B6B6B',
          fontSize: 9,
          fontWeight: 500,
          fontStyle: 'normal',
          lineHeight: 'normal',
        }}
      >
        {tag}
      </span>
    </div>
    <div
      style={{
        marginTop: 9,
        width: 649,
        height: 1.5,
        background: '#D9D9D9',
        borderRadius: 1,
      }}
    />
  </div>
);

// Source Webpages 区域占位组件 - 学习参考代码的样式
const SourceWebpagesPlaceholders: React.FC = () => (
  <div
    className="flex justify-center"
    style={{ marginTop: 11, width: 649, marginLeft: 'auto', marginRight: 'auto' }}
  >
    {[0, 1, 2, 3].map((i) => (
      <div
        key={i}
        style={{
          width: 114,
          height: 73,
          flexShrink: 0,
          borderRadius: 8,
          border: '1px solid rgba(179, 179, 179, 0.58)',
          background: 'rgba(236, 241, 246, 0.55)',
          boxShadow: '0px 1px 15px 0px rgba(73, 127, 255, 0.10)',
          marginRight: i < 3 ? 18 : 0,
        }}
      />
    ))}
    {/* More 按钮 placeholder */}
    <div
      style={{
        width: 77,
        height: 73,
        flexShrink: 0,
        borderRadius: 8,
        border: '1px solid rgba(179, 179, 179, 0.58)',
        background: 'rgba(236, 241, 246, 0.55)',
        boxShadow: '0px 1px 15px 0px rgba(73, 127, 255, 0.10)',
        marginLeft: 18,
      }}
    />
  </div>
);

// 用户提问气泡组件 - 学习参考代码的样式
const UserQuestionBubble: React.FC<{ content: string; time: string; style?: React.CSSProperties }> = ({ content, time, style }) => (
  <div className="flex flex-col items-end mb-6" style={{ ...style, width: 649, marginLeft: 'auto', marginRight: 'auto' }}>
    <span
      className="font-medium"
      style={{
        color: '#636363',
        fontFamily: 'Inter',
        fontSize: 10,
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: 'normal',
        marginBottom: 2,
        alignSelf: 'flex-end',
      }}
    >
      {time}
    </span>
    <div
      className="flex items-center justify-center"
      style={{
        width: 163,
        height: 34,
        flexShrink: 0,
        borderRadius: 10,
        background: '#ECF1F6',
        alignSelf: 'flex-end',
      }}
    >
      <span
        style={{
          color: '#000',
          fontFamily: 'Inter',
          fontSize: 13,
          fontWeight: 500,
          fontStyle: 'normal',
          lineHeight: 'normal',
        }}
      >
        {content}
      </span>
    </div>
  </div>
);

// 正文解释部分组件 - 学习参考代码的样式
const AnswerBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ width: 649, margin: '18px auto 0 auto' }}>
    <div
      style={{
        color: '#000',
        fontSize: 12,
        fontWeight: 400,
        fontStyle: 'normal',
        lineHeight: 'normal',
        fontFamily: 'Inter',
        textAlign: 'left',
      }}
    >
      {children}
    </div>
    <div
      style={{
        marginTop: 16,
        width: 649,
        height: 1.5,
        background: '#D9D9D9',
        borderRadius: 1,
      }}
    />
  </div>
);

// Follow Up Response 组件 - 学习参考代码的样式
const FollowUpResponse: React.FC<{ time: string }> = ({ time }) => (
  <div className="flex flex-col" style={{ marginTop: 45, width: 649, marginLeft: 'auto', marginRight: 'auto' }}>
    {/* Meta 信息行 */}
    <div className="flex items-center mb-1">
      <span
        className="flex items-center justify-center"
        style={{
          width: 56,
          height: 16,
          flexShrink: 0,
          borderRadius: 8,
          border: '1px solid #D9D9D9',
          background: '#F9F9F9',
          color: '#6B6B6B',
          fontFamily: 'Inter',
          fontSize: 9,
          fontWeight: 500,
          lineHeight: 'normal',
        }}
      >
        Follow Up
      </span>
      <span
        style={{
          marginLeft: 4,
          color: '#636363',
          fontFamily: 'Inter',
          fontSize: 10,
          fontWeight: 500,
          lineHeight: 'normal',
        }}
      >
        {time}
      </span>
    </div>

    {/* Follow Up 对话框 */}
    <div
      style={{
        width: 649,
        borderRadius: 10,
        background: '#ECF1F6',
        flexShrink: 0,
        padding: '12px 14px',
      }}
    >
      <div
        style={{
          color: '#000',
          fontFamily: 'Inter',
          fontSize: 13,
          fontWeight: 400,
          fontStyle: 'normal',
          lineHeight: 'normal',
        }}
      >
        悖论的核心矛盾
        量子决定性：给定量子系统的当前状态，未来状态可以被唯一确定；反之亦然。
        可逆性：量子力学演化是幺正的，即信息不会被破坏或丢失。
        霍金辐射的"无信息"：霍金辐射看似不携带黑洞内部的信息，信息似乎永久丢失。

        解决思路与主要理论
        2.1 全息原理与AdS/CFT对偶
        全息原理（Holographic Principle）认为，描述一个空间区域的所有物理信息，可以被编码在该区域的边界上（如黑洞的事件视界）。AdS/CFT对偶是这一原理的数学实现，它指出，一个五维反德西特空间（AdS）中的量子引力理论，等价于其四维边界上的共形场论（CFT）。在这种框架下，黑洞内部的信息可以被"映射"到边界上，从而避免信息丢失。

        全息原理的提出，解决了黑洞信息悖论的部分难题，并提供了新的理论工具。它表明，信息实际上并未丢失，而是以某种方式被"编码"在黑洞边界或外部宇宙中。
      </div>
    </div>
  </div>
);

function DeepLearnResponse({ onBack, isSplit = false }: DeepLearnResponseProps) {
  const [selectedMode, setSelectedMode] = useState<'deep-learn' | 'quick-search'>('deep-learn');
  const [selectedTopic, setSelectedTopic] = useState('New Topic');
  const [hoverNode, setHoverNode] = useState<CustomNode | null>(null);

  return (
    <div className={`${isSplit ? 'h-[calc(100vh-183px)]' : 'h-[calc(100vh-183px)]'} flex flex-col bg-white`}>
      {/* Header - 学习参考代码的布局和风格 */}
      <div className="flex items-center justify-between pt-4 pr-4 pl-4 pb-[18px] bg-white">
        <div className="flex items-center gap-[13px]">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="p-0 w-5 h-5 flex-shrink-0"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
          <h1 className="font-['Inter',Helvetica] text-[14px] font-medium text-black leading-normal">
            Learning Journey: Exploration of Black Hole and its Related Concepts
          </h1>
        </div>

        <div className="flex items-center" style={{gap: '23px'}}>
          {/* Publish to Community 按钮 - 学习参考代码的样式 */}
          <button
            className="flex items-center justify-between w-[163px] h-[25px] flex-shrink-0 rounded-[8px] bg-[#80A5E4] px-3 py-0"
            style={{fontFamily: 'Inter', fontSize: 12, fontWeight: 500, color: '#FFF', lineHeight: 'normal'}}
          >
            <span className="whitespace-nowrap">Publish to Community</span>
            <span className="ml-1 flex items-center">
              {/* Publish SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                <path d="M0.750977 10.2709C0.750977 8.62163 1.66919 7.17486 3.04917 6.36176C3.42449 3.57291 5.94612 1.41675 9.00098 1.41675C12.0558 1.41675 14.5775 3.57291 14.9528 6.36176C16.3328 7.17486 17.251 8.62163 17.251 10.2709C17.251 12.6945 15.2681 14.6808 12.751 14.8617L5.25098 14.8751C2.73381 14.6808 0.750977 12.6945 0.750977 10.2709ZM12.6372 13.4491C14.3873 13.3233 15.751 11.9398 15.751 10.2709C15.751 9.15671 15.1423 8.14322 14.1588 7.56374L13.5545 7.20766L13.4648 6.54039C13.1811 4.43285 11.2726 2.83341 9.00098 2.83341C6.72935 2.83341 4.82083 4.43285 4.5372 6.54039L4.4474 7.20766L3.84314 7.56374C2.85965 8.14322 2.25098 9.15671 2.25098 10.2709C2.25098 11.9398 3.61472 13.3233 5.36475 13.4491L5.49473 13.4584H12.5072L12.6372 13.4491ZM9.75098 9.20841V12.0417H8.25098V9.20841H6.00098L9.00098 5.66675L12.001 9.20841H9.75098Z" fill="white"/>
              </svg>
            </span>
          </button>

          {/* 分享按钮 - 学习参考代码的样式 */}
          <button
            className="flex items-center justify-center w-[18px] h-[18px] flex-shrink-0"
            style={{marginRight: '18px'}}
            aria-label="Share"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 18.3334C14.3056 18.3334 13.7153 18.0904 13.2292 17.6042C12.7431 17.1181 12.5 16.5279 12.5 15.8334C12.5 15.7362 12.5069 15.6355 12.5208 15.5313C12.5347 15.4272 12.5556 15.3334 12.5833 15.2501L6.70833 11.8334C6.47222 12.0417 6.20833 12.2049 5.91667 12.323C5.625 12.4411 5.31944 12.5001 5 12.5001C4.30556 12.5001 3.71528 12.257 3.22917 11.7709C2.74306 11.2848 2.5 10.6945 2.5 10.0001C2.5 9.30564 2.74306 8.71536 3.22917 8.22925C3.71528 7.74314 4.30556 7.50008 5 7.50008C5.31944 7.50008 5.625 7.55911 5.91667 7.67717C6.20833 7.79522 6.47222 7.95842 6.70833 8.16675L12.5833 4.75008C12.5556 4.66675 12.5347 4.573 12.5208 4.46883C12.5069 4.36466 12.5 4.26397 12.5 4.16675C12.5 3.4723 12.7431 2.88203 13.2292 2.39591C13.7153 1.9098 14.3056 1.66675 15 1.66675C15.6944 1.66675 16.2847 1.9098 16.7708 2.39591C17.2569 2.88203 17.5 3.4723 17.5 4.16675C17.5 4.86119 17.2569 5.45147 16.7708 5.93758C16.2847 6.42369 15.6944 6.66675 15 6.66675C14.6806 6.66675 14.375 6.60772 14.0833 6.48967C13.7917 6.37161 13.5278 6.20842 13.2917 6.00008L7.41667 9.41675C7.44444 9.50008 7.46528 9.59383 7.47917 9.698C7.49306 9.80217 7.5 9.90286 7.5 10.0001C7.5 10.0973 7.49306 10.198 7.47917 10.3022C7.46528 10.4063 7.44444 10.5001 7.41667 10.5834L13.2917 14.0001C13.5278 13.7917 13.7917 13.6286 14.0833 13.5105C14.375 13.3924 14.6806 13.3334 15 13.3334C15.6944 13.3334 16.2847 13.5765 16.7708 14.0626C17.2569 14.5487 17.5 15.139 17.5 15.8334C17.5 16.5279 17.2569 17.1181 16.7708 17.6042C16.2847 18.0904 15.6944 18.3334 15 18.3334ZM15 5.00008C15.2361 5.00008 15.434 4.92022 15.5938 4.7605C15.7535 4.60078 15.8333 4.40286 15.8333 4.16675C15.8333 3.93064 15.7535 3.73272 15.5938 3.573C15.434 3.41328 15.2361 3.33341 15 3.33341C14.7639 3.33341 14.566 3.41328 14.4062 3.573C14.2465 3.73272 14.1667 3.93064 14.1667 4.16675C14.1667 4.40286 14.2465 4.60078 14.4062 4.7605C14.566 4.92022 14.7639 5.00008 15 5.00008ZM5 10.8334C5.23611 10.8334 5.43403 10.7536 5.59375 10.5938C5.75347 10.4341 5.83333 10.2362 5.83333 10.0001C5.83333 9.76397 5.75347 9.56605 5.59375 9.40633C5.43403 9.24661 5.23611 9.16675 5 9.16675C4.76389 9.16675 4.56597 9.24661 4.40625 9.40633C4.24653 9.56605 4.16667 9.76397 4.16667 10.0001C4.16667 10.2362 4.24653 10.4341 4.40625 10.5938C4.56597 10.7536 4.76389 10.8334 5 10.8334ZM15 16.6667C15.2361 16.6667 15.434 16.5869 15.5938 16.4272C15.7535 16.2674 15.8333 16.0695 15.8333 15.8334C15.8333 15.5973 15.7535 15.3994 15.5938 15.2397C15.434 15.0799 15.2361 15.0001 15 15.0001C14.7639 15.0001 14.566 15.0799 14.4062 15.2397C14.2465 15.3994 14.1667 15.5973 14.1667 15.8334C14.1667 16.0695 14.2465 16.2674 14.4062 16.4272C14.566 16.5869 14.7639 16.6667 15 16.6667Z" fill="#79747E"/>
            </svg>
          </button>

          {/* 打印按钮 - 学习参考代码的样式 */}
          <button
            className="flex items-center justify-center w-[18px] h-[18px] flex-shrink-0 mr-[57px]"
            aria-label="Print"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <g clipPath="url(#clip0_2053_890)">
                <path d="M4.5 6.75V1.5H13.5V6.75M4.5 13.5H3C2.60218 13.5 2.22064 13.342 1.93934 13.0607C1.65804 12.7794 1.5 12.3978 1.5 12V8.25C1.5 7.85218 1.65804 7.47064 1.93934 7.18934C2.22064 6.90804 2.60218 6.75 3 6.75H15C15.3978 6.75 15.7794 6.90804 16.0607 7.18934C16.342 7.47064 16.5 7.85218 16.5 8.25V12C16.5 12.3978 16.342 12.7794 16.0607 13.0607C15.7794 13.342 15.3978 13.5 15 13.5H13.5M4.5 10.5H13.5V16.5H4.5V10.5Z" stroke="#757575" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <defs>
                <clipPath id="clip0_2053_890">
                  <rect width="18" height="18" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-y-auto">
        {/* 整个内容区域居中 */}
        <div className="flex-1 flex justify-center">
          <div className="flex gap-[150px]">
            {/* Main Content - Scrollable */}
            <div className="w-[649px] overflow-y-auto py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {/* User Question - 学习参考代码的conversation样式 */}
              <UserQuestionBubble content="黑洞信息悖论如何解决？" time="Me, Jun 1, 9:50 PM" />

              {/* AI Response - 学习参考代码的conversation样式 */}
              <div className="prose max-w-none font-['Inter',Helvetica] text-sm leading-relaxed">
                <AnswerHeader title="黑洞信息悖论如何解决？" tag="Deep Learn" />
                <SourceWebpagesPlaceholders />
                <AnswerBody>
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
                        有理论提出，信息本身不是先天固有的，而是后天生成的，物质与信息相互关联。落入黑洞的物质信息会转化为热辐射、热熵等量子态，通过量子信息科学和经典热力学的结合，信息得以保留。
                      </p>
                    </div>
                  </div>
                </AnswerBody>

                {/* 新一轮提问，vertical spacing 40px - 学习参考代码的样式 */}
                <UserQuestionBubble
                  content="黑洞信息悖论如何解决？"
                  time="Me, Jun 1, 9:55 PM"
                  style={{ marginTop: 40 }}
                />

                {/* Follow Up Response - 学习参考代码的样式 */}
                <FollowUpResponse time="Jun 1, 9:58 PM" />

                {/* 底部空白区域，确保内容可以滚动超过输入框 */}
                <div className="h-32"></div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className={`${isSplit ? 'w-[220px]' : 'w-[320px]'} flex flex-col ${isSplit ? 'h-[calc(100vh-315px)]' : 'h-[calc(100vh-255px)]'} gap-[22px]`}>

              {/* Fixed Right Sidebar - Related Contents */}
              <div 
                className="flex flex-col row-span-3"
                style={{
                  width: '256px',
                  height: '648px',
                  flexShrink: 0,
                  borderRadius: '13px',
                  borderTop: '1px solid rgba(73, 127, 255, 0.22)',
                  borderRight: '1px solid rgba(73, 127, 255, 0.22)',
                  borderLeft: '1px solid rgba(73, 127, 255, 0.22)',
                  background: '#FFF',
                  boxShadow: '0px 1px 30px 2px rgba(73, 127, 255, 0.05)'
                }}
              >
                {/* Title Section */}
                <div 
                  className="flex-shrink-0"
                  style={{
                    width: '256px',
                    height: '58.722px',
                    borderTopLeftRadius: '13px',
                    borderTopRightRadius: '13px',
                    borderTop: '1px solid rgba(73, 127, 255, 0.22)',
                    borderRight: '1px solid rgba(73, 127, 255, 0.22)',
                    borderLeft: '1px solid rgba(73, 127, 255, 0.22)',
                    background: '#ECF1F6',
                    padding: '12px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  {/* First row - Icon and "Related Contents" text */}
                  <div className="flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="18.432" 
                      height="18" 
                      viewBox="0 0 19 18" 
                      fill="none"
                      style={{ flexShrink: 0, marginRight: '8px' }}
                    >
                      <path d="M6.02373 15.4239H4.29573C4.14296 15.4239 3.99645 15.3646 3.88843 15.2591C3.78041 15.1536 3.71973 15.0105 3.71973 14.8614C3.71973 14.7122 3.78041 14.5691 3.88843 14.4636C3.99645 14.3581 4.14296 14.2989 4.29573 14.2989H5.58021L6.02373 12.9939C6.04777 12.9236 6.0858 12.8586 6.13563 12.8027C6.18545 12.7469 6.2461 12.7011 6.31407 12.6682C6.38205 12.6353 6.45601 12.6158 6.53172 12.6109C6.60743 12.6059 6.6834 12.6157 6.75525 12.6395C6.89925 12.687 7.0182 12.7881 7.08617 12.9209C7.15415 13.0536 7.16563 13.2072 7.11813 13.3482L6.54213 15.0357C6.50612 15.1441 6.43728 15.2392 6.34471 15.3085C6.25215 15.3778 6.14021 15.418 6.02373 15.4239Z" fill="#FF8F00"/>
                      <path d="M3.71938 15.9863C3.49154 15.9863 3.26881 15.9203 3.07937 15.8417C2.88992 15.718 2.74227 15.5423 2.65507 15.3368C2.56788 15.1312 2.54507 14.905 2.58952 14.6868C2.63397 14.4685 2.74369 14.2681 2.9048 14.1108C3.06591 13.9534 3.27117 13.8463 3.49464 13.8029C3.71811 13.7595 3.94973 13.7817 4.16023 13.8669C4.37074 13.952 4.55065 14.0962 4.67724 14.2812C4.80382 14.4662 4.87138 14.6837 4.87138 14.9063C4.87138 15.2046 4.75001 15.4908 4.53397 15.7017C4.31793 15.9127 4.02491 16.0313 3.71938 16.0313Z" fill="#1565C0"/>
                      <path d="M5.44738 4.17384C5.37117 4.17353 5.29579 4.15845 5.22559 4.12949C5.15539 4.10052 5.09177 4.05824 5.03842 4.00509L4.05922 3.04884H3.14338C2.99062 3.04884 2.84411 2.98957 2.73609 2.88408C2.62807 2.7786 2.56738 2.63552 2.56738 2.48634C2.56738 2.33715 2.62807 2.19408 2.73609 2.08859C2.84411 1.9831 2.99062 1.92384 3.14338 1.92384H4.29538C4.37119 1.92341 4.44633 1.9376 4.51651 1.96559C4.58669 1.99358 4.65052 2.03483 4.70434 2.08696L5.85634 3.21196C5.93758 3.29064 5.99298 3.39116 6.01548 3.5007C6.03798 3.61025 6.02657 3.72386 5.9827 3.82705C5.93883 3.93023 5.86448 4.01832 5.76914 4.08009C5.6738 4.14185 5.56179 4.17449 5.44738 4.17384Z" fill="#FF8F00"/>
                      <path d="M2.56753 3.61133C2.33968 3.61133 2.11696 3.54535 1.92751 3.42173C1.73807 3.29812 1.59041 3.12241 1.50322 2.91685C1.41603 2.71128 1.39321 2.48508 1.43766 2.26685C1.48211 2.04862 1.59183 1.84817 1.75294 1.69083C1.91405 1.5335 2.11932 1.42635 2.34278 1.38295C2.56625 1.33954 2.79788 1.36182 3.00838 1.44696C3.21888 1.53211 3.3988 1.67631 3.52538 1.86131C3.65196 2.04632 3.71953 2.26382 3.71953 2.48633C3.71953 2.7847 3.59816 3.07085 3.38211 3.28182C3.16607 3.4928 2.87306 3.61133 2.56753 3.61133Z" fill="#1565C0"/>
                      <path d="M12.9067 3.61133H14.0587L14.6347 2.48633H15.7867" fill="#F57C00"/>
                      <path d="M14.0874 4.17388H12.9354C12.7826 4.17388 12.6361 4.11461 12.5281 4.00912C12.4201 3.90363 12.3594 3.76056 12.3594 3.61138C12.3594 3.46219 12.4201 3.31912 12.5281 3.21363C12.6361 3.10814 12.7826 3.04888 12.9354 3.04888H13.7303L14.1219 2.25013C14.1694 2.14983 14.2461 2.0654 14.3423 2.00738C14.4386 1.94936 14.5503 1.92031 14.6634 1.92388H15.8154C15.9681 1.92388 16.1146 1.98314 16.2227 2.08863C16.3307 2.19412 16.3914 2.33719 16.3914 2.48638C16.3914 2.63556 16.3307 2.77863 16.2227 2.88412C16.1146 2.98961 15.9681 3.04888 15.8154 3.04888H14.9917L14.577 3.85888C14.5317 3.94938 14.4624 4.02635 14.3763 4.08176C14.2902 4.13717 14.1904 4.16898 14.0874 4.17388Z" fill="#F57C00"/>
                      <path d="M16.4206 3.70703C16.1927 3.70703 15.97 3.64105 15.7805 3.51744C15.5911 3.39382 15.4434 3.21812 15.3562 3.01255C15.2691 2.80698 15.2462 2.58078 15.2907 2.36256C15.3351 2.14433 15.4449 1.94387 15.606 1.78654C15.7671 1.6292 15.9723 1.52206 16.1958 1.47865C16.4193 1.43524 16.6509 1.45752 16.8614 1.54267C17.0719 1.62782 17.2518 1.77201 17.3784 1.95702C17.505 2.14202 17.5726 2.35953 17.5726 2.58203C17.5726 2.8804 17.4512 3.16655 17.2351 3.37753C17.0191 3.58851 16.7261 3.70703 16.4206 3.70703Z" fill="#1565C0"/>
                      <path d="M16.547 13.6688L14.243 11.4188L13.5115 10.4963C13.4605 10.4363 13.3973 10.3874 13.3259 10.3525C13.2545 10.3176 13.1765 10.2977 13.0967 10.2938C13.0175 10.2896 12.9382 10.3014 12.8639 10.3285C12.7896 10.3556 12.7218 10.3974 12.6647 10.4513L10.8388 12.2176C10.7844 12.2697 10.7411 12.3318 10.7114 12.4003C10.6818 12.4689 10.6663 12.5425 10.666 12.6169C10.6656 12.691 10.6801 12.7643 10.7088 12.8329C10.7374 12.9014 10.7797 12.9637 10.8331 13.0163L14.0183 16.1438C14.3421 16.4604 14.7813 16.6384 15.2395 16.6388C15.6976 16.6384 16.1368 16.4604 16.4606 16.1438L16.5585 16.0482C16.8788 15.7305 17.0574 15.302 17.0552 14.8562C17.0531 14.4104 16.8704 13.9835 16.547 13.6688Z" fill="#304046"/>
                      <path d="M9.45075 14.2988C12.95 14.2988 15.7867 11.5286 15.7867 8.11133C15.7867 4.69407 12.95 1.92383 9.45075 1.92383C5.95147 1.92383 3.11475 4.69407 3.11475 8.11133C3.11475 11.5286 5.95147 14.2988 9.45075 14.2988Z" fill="#01579B"/>
                      <path d="M9.45095 12.0488C11.6778 12.0488 13.4829 10.2859 13.4829 8.11133C13.4829 5.93671 11.6778 4.17383 9.45095 4.17383C7.22413 4.17383 5.41895 5.93671 5.41895 8.11133C5.41895 10.2859 7.22413 12.0488 9.45095 12.0488Z" fill="#BBDEFB"/>
                      <path d="M6.02373 15.4689H4.29573C4.14296 15.4689 3.99645 15.4096 3.88843 15.3042C3.78041 15.1987 3.71973 15.0556 3.71973 14.9064C3.71973 14.7572 3.78041 14.6141 3.88843 14.5087C3.99645 14.4032 4.14296 14.3439 4.29573 14.3439H5.60901L6.05253 13.0389C6.10141 12.8972 6.20595 12.7802 6.34313 12.7138C6.48032 12.6473 6.63892 12.6368 6.78405 12.6845C6.92917 12.7323 7.04894 12.8344 7.11699 12.9683C7.18504 13.1023 7.19581 13.2572 7.14693 13.3989L6.57093 15.0864C6.53229 15.1981 6.45867 15.2952 6.36047 15.3638C6.26228 15.4324 6.14448 15.4692 6.02373 15.4689Z" fill="#FF8F00"/>
                      <path d="M3.71938 16.0313C3.49154 16.0313 3.26881 15.9653 3.07937 15.8417C2.88992 15.718 2.74227 15.5423 2.65507 15.3368C2.56788 15.1312 2.54507 14.905 2.58952 14.6868C2.63397 14.4685 2.74369 14.2681 2.9048 14.1108C3.06591 13.9534 3.27117 13.8463 3.49464 13.8029C3.71811 13.7595 3.94973 13.7817 4.16023 13.8669C4.37074 13.952 4.55065 14.0962 4.67724 14.2812C4.80382 14.4662 4.87138 14.6837 4.87138 14.9063C4.87138 15.2046 4.75001 15.4908 4.53397 15.7017C4.31793 15.9127 4.02491 16.0313 3.71938 16.0313Z" fill="#0277BD"/>
                      <path d="M5.44738 4.21876C5.37158 4.21919 5.29643 4.205 5.22625 4.17701C5.15607 4.14901 5.09224 4.10777 5.03842 4.05563L4.05922 3.09376H3.14338C2.99062 3.09376 2.84411 3.0345 2.73609 2.92901C2.62807 2.82352 2.56738 2.68044 2.56738 2.53126C2.56738 2.38208 2.62807 2.239 2.73609 2.13351C2.84411 2.02802 2.99062 1.96876 3.14338 1.96876H4.29538C4.37119 1.96833 4.44633 1.98252 4.51651 2.01051C4.58669 2.03851 4.65052 2.07975 4.70434 2.13188L5.85634 3.25688C5.91033 3.30918 5.95318 3.37139 5.98242 3.43993C6.01167 3.50848 6.02672 3.582 6.02672 3.65626C6.02672 3.73052 6.01167 3.80404 5.98242 3.87258C5.95318 3.94113 5.91033 4.00334 5.85634 4.05563C5.80252 4.10777 5.73869 4.14901 5.66851 4.17701C5.59833 4.205 5.52319 4.21919 5.44738 4.21876Z" fill="#FF8F00"/>
                      <path d="M2.56753 3.65625C2.33968 3.65625 2.11696 3.59027 1.92751 3.46665C1.73807 3.34304 1.59041 3.16734 1.50322 2.96177C1.41603 2.7562 1.39321 2.53 1.43766 2.31177C1.48211 2.09355 1.59183 1.89309 1.75294 1.73576C1.91405 1.57842 2.11932 1.47128 2.34278 1.42787C2.56625 1.38446 2.79788 1.40674 3.00838 1.49189C3.21888 1.57703 3.3988 1.72123 3.52538 1.90623C3.65196 2.09124 3.71953 2.30875 3.71953 2.53125C3.71953 2.82962 3.59816 3.11577 3.38211 3.32675C3.16607 3.53772 2.87306 3.65625 2.56753 3.65625Z" fill="#0277BD"/>
                      <path d="M3.14355 8.15625C3.14355 9.79728 3.8111 11.3711 4.99933 12.5315C6.18756 13.6919 7.79914 14.3438 9.47955 14.3438V1.96875C7.79914 1.96875 6.18756 2.62065 4.99933 3.78103C3.8111 4.94141 3.14355 6.51522 3.14355 8.15625Z" fill="#0277BD"/>
                      <path d="M5.44775 8.15625C5.44775 9.20054 5.87255 10.2021 6.6287 10.9405C7.38485 11.6789 8.4104 12.0938 9.47975 12.0938V4.21875C8.4104 4.21875 7.38485 4.63359 6.6287 5.37202C5.87255 6.11044 5.44775 7.11196 5.44775 8.15625Z" fill="#E3F2FD"/>
                    </svg>
                    <span
                      style={{
                        color: '#0064A2',
                        fontFamily: 'Inter',
                        fontSize: '12px',
                        fontWeight: 500,
                        lineHeight: 'normal'
                      }}
                    >
                      Related Contents
                    </span>
                  </div>
                  
                  {/* Second row - "See more on this topic" text */}
                  <div style={{ marginLeft: '4px' }}>
                    <span
                      style={{
                        color: '#000000',
                        fontFamily: 'Inter',
                        fontSize: '14px',
                        fontWeight: 600,
                        lineHeight: 'normal'
                      }}
                    >
                      See more on this topic
                    </span>
                  </div>
                </div>

                {/* Scrollable Content Section */}
                <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <div className="bg-white m-4">
                    {/* Content will go here */}
                  </div>
                </div>
              </div>

              {/* Fixed Right Sidebar - Concept Map */}
              <div 
                className="flex flex-col"
                style={{
                  width: '256px',
                  height: '228.464px',
                  flexShrink: 0,
                  borderRadius: '13px',
                  borderTop: '1px solid rgba(157, 155, 179, 0.30)',
                  borderLeft: '1px solid rgba(157, 155, 179, 0.30)',
                  borderRight: '1px solid rgba(157, 155, 179, 0.30)',
                  background: '#FFFFFF',
                  boxShadow: '0px 1px 30px 2px rgba(242, 242, 242, 0.63)',
                  marginTop: '22px'
                }}
              >
                {/* Header Section */}
                <div 
                  className="flex-shrink-0"
                  style={{
                    width: '256px',
                    height: '59.736px',
                    background: 'rgba(228, 231, 239, 0.62)',
                    borderTopLeftRadius: '13px',
                    borderTopRightRadius: '13px',
                    borderTop: '1px solid #E2E1E8',
                    borderLeft: '1px solid #E2E1E8',
                    borderRight: '1px solid #E2E1E8',
                    padding: '12px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  {/* First row - Icon and "Concept Map" text */}
                  <div className="flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="17" 
                      height="17" 
                      viewBox="0 0 17 17" 
                      fill="none"
                      style={{ marginRight: '8px' }}
                    >
                      <path d="M11.9264 14.9334L9.03108 13.4831V13.2812C9.03108 13.1404 8.97511 13.0052 8.87548 12.9056C8.77585 12.806 8.64073 12.75 8.49983 12.75C8.35893 12.75 8.22381 12.806 8.12418 12.9056C8.02455 13.0052 7.96858 13.1404 7.96858 13.2812V13.4831L5.07327 14.9334C4.95833 15.0026 4.87381 15.1127 4.83668 15.2416C4.79955 15.3705 4.81255 15.5086 4.87307 15.6283C4.9336 15.7481 5.03717 15.8404 5.16299 15.8869C5.28881 15.9334 5.42756 15.9306 5.55139 15.8791L7.96858 14.6731V14.875C7.96858 15.0159 8.02455 15.151 8.12418 15.2507C8.22381 15.3503 8.35893 15.4062 8.49983 15.4062C8.64073 15.4062 8.77585 15.3503 8.87548 15.2507C8.97511 15.151 9.03108 15.0159 9.03108 14.875V14.6731L11.4483 15.8791C11.5217 15.9184 11.604 15.9385 11.6873 15.9375C11.7854 15.9372 11.8815 15.9097 11.965 15.8582C12.0485 15.8066 12.116 15.7329 12.1601 15.6453C12.2232 15.5198 12.2339 15.3745 12.1901 15.2411C12.1463 15.1078 12.0515 14.9971 11.9264 14.9334Z" fill="#263238"/>
                      <path d="M12.1763 10.9544C12.1364 10.8574 12.0687 10.7743 11.9818 10.7157C11.8948 10.6571 11.7924 10.6255 11.6875 10.625H5.31251C5.20763 10.6255 5.10525 10.6571 5.01827 10.7157C4.9313 10.7743 4.86362 10.8574 4.82376 10.9544C4.78308 11.0511 4.77197 11.1578 4.79182 11.2608C4.81168 11.3639 4.86161 11.4587 4.93533 11.5334L6.52908 13.1272C6.57872 13.1764 6.63759 13.2154 6.70231 13.2418C6.76704 13.2683 6.83635 13.2817 6.90626 13.2812H8.50001V10.625H5.31251Z" fill="#FFA000"/>
                      <path d="M14.3437 1.0625H2.65625C1.77605 1.0625 1.0625 1.77605 1.0625 2.65625V10.0938C1.0625 10.974 1.77605 11.6875 2.65625 11.6875H14.3437C15.224 11.6875 15.9375 10.974 15.9375 10.0938V2.65625C15.9375 1.77605 15.224 1.0625 14.3437 1.0625Z" fill="#455A64"/>
                      <path d="M12.2188 4.78125H4.78125C4.64035 4.78125 4.50523 4.72528 4.4056 4.62565C4.30597 4.52602 4.25 4.3909 4.25 4.25C4.25 4.1091 4.30597 3.97398 4.4056 3.87435C4.50523 3.77472 4.64035 3.71875 4.78125 3.71875H12.2188C12.3596 3.71875 12.4948 3.77472 12.5944 3.87435C12.694 3.97398 12.75 4.1091 12.75 4.25C12.75 4.3909 12.694 4.52602 12.5944 4.62565C12.4948 4.72528 12.3596 4.78125 12.2188 4.78125Z" fill="#BDBDBD"/>
                      <path d="M7.4375 6.90625H4.78125C4.64035 6.90625 4.50523 6.85028 4.4056 6.75065C4.30597 6.65102 4.25 6.5159 4.25 6.375C4.25 6.2341 4.30597 6.09898 4.4056 5.99935C4.50523 5.89972 4.64035 5.84375 4.78125 5.84375H7.4375C7.5784 5.84375 7.71352 5.89972 7.81315 5.99935C7.91278 6.09898 7.96875 6.2341 7.96875 6.375C7.96875 6.5159 7.91278 6.65102 7.81315 6.75065C7.71352 6.85028 7.5784 6.90625 7.4375 6.90625Z" fill="#F5F5F5"/>
                      <path d="M10.0938 9.03125H4.78125C4.64035 9.03125 4.50523 8.97528 4.4056 8.87565C4.30597 8.77602 4.25 8.6409 4.25 8.5C4.25 8.3591 4.30597 8.22398 4.4056 8.12435C4.50523 8.02472 4.64035 7.96875 4.78125 7.96875H10.0938C10.2346 7.96875 10.3698 8.02472 10.4694 8.12435C10.569 8.22398 10.625 8.3591 10.625 8.5C10.625 8.6409 10.569 8.77602 10.4694 8.87565C10.3698 8.97528 10.2346 9.03125 10.0938 9.03125Z" fill="#BDBDBD"/>
                      <path d="M7.96858 13.2812V13.4831L5.07327 14.9334C4.95833 15.0026 4.87381 15.1127 4.83668 15.2416C4.79955 15.3705 4.81255 15.5086 4.87307 15.6283C4.9336 15.7481 5.03717 15.8404 5.16299 15.8869C5.28881 15.9334 5.42756 15.9306 5.55139 15.8791L7.96858 14.6731V14.875C7.96858 15.0159 8.02455 15.151 8.12418 15.2507C8.22381 15.3503 8.35893 15.4062 8.49983 15.4062V12.75C8.35893 12.75 8.22381 12.806 8.12418 12.9056C8.02455 13.0052 7.96858 13.1404 7.96858 13.2812Z" fill="#616161"/>
                      <path d="M5.31251 10.625C5.20763 10.6255 5.10525 10.6571 5.01827 10.7157C4.9313 10.7743 4.86362 10.8574 4.82376 10.9544C4.78308 11.0511 4.77197 11.1578 4.79182 11.2608C4.81168 11.3639 4.86161 11.4587 4.93533 11.5334L6.52908 13.1272C6.57872 13.1764 6.63759 13.2154 6.70231 13.2418C6.76704 13.2683 6.83635 13.2817 6.90626 13.2812H8.50001V10.625H5.31251Z" fill="#FFA000"/>
                      <path d="M2.65625 1.0625C2.23356 1.0625 1.82818 1.23041 1.5293 1.5293C1.23041 1.82818 1.0625 2.23356 1.0625 2.65625V10.0938C1.0625 10.5164 1.23041 10.9218 1.5293 11.2207C1.82818 11.5196 2.23356 11.6875 2.65625 11.6875H8.5V1.0625H2.65625Z" fill="#78909C"/>
                      <path d="M4.78125 3.71875C4.64035 3.71875 4.50523 3.77472 4.4056 3.87435C4.30597 3.97398 4.25 4.1091 4.25 4.25C4.25 4.3909 4.30597 4.52602 4.4056 4.62565C4.50523 4.72528 4.64035 4.78125 4.78125 4.78125H8.5V3.71875H4.78125Z" fill="#F5F5F5"/>
                      <path d="M7.4375 5.84375H4.78125C4.64035 5.84375 4.50523 5.89972 4.4056 5.99935C4.30597 6.09898 4.25 6.2341 4.25 6.375C4.25 6.5159 4.30597 6.65102 4.4056 6.75065C4.50523 6.85028 4.64035 6.90625 4.78125 6.90625H7.4375C7.5784 6.90625 7.71352 6.85028 7.81315 6.75065C7.91278 6.65102 7.96875 6.5159 7.96875 6.375C7.96875 6.2341 7.91278 6.09898 7.81315 5.99935C7.71352 5.89972 7.5784 5.84375 7.4375 5.84375Z" fill="#F5F5F5"/>
                      <path d="M4.78125 7.96875C4.64035 7.96875 4.50523 8.02472 4.4056 8.12435C4.30597 8.22398 4.25 8.3591 4.25 8.5C4.25 8.6409 4.30597 8.77602 4.4056 8.87565C4.50523 8.97528 4.64035 9.03125 4.78125 9.03125H8.5V7.96875H4.78125Z" fill="#F5F5F5"/>
                    </svg>
                    <span
                      style={{
                        color: '#63626B',
                        fontFamily: 'Inter',
                        fontSize: '12px',
                        fontWeight: 500,
                        lineHeight: 'normal'
                      }}
                    >
                      Concept Map
                    </span>
                  </div>
                  
                  {/* Second row - "Your Learning Roadmap" text */}
                  <div style={{ marginLeft: '4px' }}>
                    <span
                      style={{
                        color: '#000000',
                        fontFamily: 'Inter',
                        fontSize: '14px',
                        fontWeight: 600,
                        lineHeight: 'normal'
                      }}
                    >
                      Your Learning Roadmap
                    </span>
                  </div>
                </div>

                {/* Content Section - Scaled Concept Map */}
                <div className="flex-1 overflow-hidden">
                  <div className="w-full h-full bg-white">
                    <ForceGraph2D
                      graphData={myData}
                      width={256}
                      height={168}
                      nodeAutoColorBy="group"
                      onNodeHover={(node: NodeObject | null) => {
                        setHoverNode(node as CustomNode | null);
                      }}
                      nodeCanvasObject={(node: CustomNode, ctx, globalScale) => {
                        const label = node.id;
                        const fontSize = 10 / globalScale;
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
                      linkPointerAreaPaint={(node: CustomNode, color, ctx) => {
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
      </div>

      {/* Fixed Bottom Input Box - 相对于对话区域对齐 */}
      <div className="fixed bottom-[35px] left-1/2 transform -translate-x-1/2 w-[649px] bg-white border border-gray-300 rounded-2xl px-4 py-2 shadow-sm h-[120px] text-[12px] flex flex-col justify-between">
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
  );
}

export default DeepLearnResponse;