export interface TechnicalDirection {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export const technicalDirections: TechnicalDirection[] = [
  {
    id: "algorithm",
    title: "算法",
    icon: "🧩",
    description: "从数据结构与算法基础出发，训练问题分析与解题能力。",
  },
  {
    id: "frontend",
    title: "前端开发",
    icon: "🎨",
    description: "用现代 Web 技术构建清晰、易用且富有交互感的界面。",
  },
  {
    id: "backend",
    title: "后端开发",
    icon: "⚙️",
    description: "学习服务、数据库与接口开发，为产品提供可靠支撑。",
  },
  {
    id: "game-development",
    title: "游戏开发",
    icon: "🎮",
    description: "在程序、设计与创意的协作中完成游戏作品。",
  },
  {
    id: "machine-learning",
    title: "机器学习",
    icon: "📈",
    description: "通过数据、模型与实践项目理解机器学习的基本方法。",
  },
  {
    id: "graphics",
    title: "图形学",
    icon: "✨",
    description: "探索三维渲染、材质与 Shader 背后的图形技术。",
  },
  {
    id: "artificial-intelligence",
    title: "人工智能",
    icon: "🤖",
    description: "从计算机视觉与自然语言处理等方向探索 AI 应用。",
  },
];
