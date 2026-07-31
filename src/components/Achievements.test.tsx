import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import Achievements from "./Achievements";

it("shows the original overview cards with event descriptions", () => {
  render(<Achievements />);

  expect(screen.getByText("省级奖项 100+")).toBeVisible();
  expect(screen.getByText("国家级奖项 50+")).toBeVisible();
  expect(screen.getByText("项目实践 多次立项")).toBeVisible();
  expect(screen.getByText("毕业生去向 大厂 / 名校深造")).toBeVisible();
  expect(screen.getByText("蓝桥杯、天梯赛、睿抗。")).toBeVisible();
  expect(
    screen.getByText("蓝桥杯、天梯赛、睿抗、ICPC、CCPC。"),
  ).toBeVisible();
  expect(screen.getByText("服务外包、软件大赛、挑战杯。")).toBeVisible();
  expect(
    screen.getByText("985、211 等名校；字节跳动、阿里巴巴等互联网头部大厂。"),
  ).toBeVisible();
  expect(screen.getByText("天梯赛省赛 6 人次、国赛 10 人次。")).toBeVisible();
  expect(
    screen.getByText(
      "睿抗省赛 5 人次、国赛 3 人次；ICPC 陕西全国邀请赛铜奖；CCPC 郑州全国邀请赛银奖。",
    ),
  ).toBeVisible();
  expect(
    screen.getByText(
      "睿抗省赛 10 人次、国赛 5 人次；天梯赛四川省赛团队一等奖/三等奖、全国总决赛团队二等奖；ICPC 陕西全国邀请赛铜奖；CCPC 福州全国邀请赛铜奖。",
    ),
  ).toBeVisible();
  expect(screen.getByText("中国大学生服务外包创新创业大赛")).toBeVisible();
  expect(screen.queryByText("CCF CAT")).not.toBeInTheDocument();
  expect(
    screen.queryByText("展示数字与赛事标签均待正式资料确认。"),
  ).not.toBeInTheDocument();
});
