export type TechnicalDirectionId =
  | "full-stack"
  | "agent-development"
  | "game-development"
  | "machine-learning"
  | "graphics";

export interface TechnicalDirection {
  id: TechnicalDirectionId;
  title: string;
  description: string;
}

export const technicalDirections: TechnicalDirection[] = [
  {
    id: "full-stack",
    title: "全栈开发",
    description: "整合前端界面、服务端与数据库能力，完成完整产品开发。",
  },
  {
    id: "agent-development",
    title: "Agent 开发",
    description: "探索大模型 Agent、工具调用与自动化工作流，构建可靠的智能应用。",
  },
  {
    id: "game-development",
    title: "游戏开发",
    description: "在程序、设计与创意的协作中完成游戏作品。",
  },
  {
    id: "machine-learning",
    title: "机器学习",
    description: "通过数据、模型与实践项目理解机器学习的基本方法。",
  },
  {
    id: "graphics",
    title: "图形学",
    description: "探索三维渲染、材质与 Shader 背后的图形技术。",
  },
];
