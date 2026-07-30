import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import Timeline from "./Timeline";

it("renders the newest imported activity first without temporary history copy", () => {
  render(<Timeline />);

  expect(screen.getByRole("heading", { name: "我们最近在" })).toBeInTheDocument();
  expect(screen.getAllByRole("article")[0]).toHaveTextContent("祝陈居浩生日快乐");
  expect(screen.queryByText(/临时展示|正式历史资料待补充/)).not.toBeInTheDocument();
});
