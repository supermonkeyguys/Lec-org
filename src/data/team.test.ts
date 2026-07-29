import { describe, expect, it } from "vitest";
import { teamInfo } from "./team";

describe("PDF-aligned team information", () => {
  it("models the founding month, approximate size, attendance, and stated mission", () => {
    expect(teamInfo.founded).toEqual({ year: 2010, month: 6 });
    expect(teamInfo.memberCount).toEqual({ value: 30, approximate: true });
    expect(teamInfo.weeklyAttendanceHours).toBe(28);
    expect(teamInfo.mission).toBe("学以致用，服务学校，走向社会");
  });

  it("does not retain unsupported legacy claims", () => {
    expect(JSON.stringify(teamInfo)).not.toMatch(
      /十年|10 年积累|白板|校友网络|代码 review|服务器/,
    );
  });

  it("stores the supplied four-paragraph studio introduction", () => {
    const introduction = (
      teamInfo.content as { introduction?: readonly string[] }
    ).introduction;

    expect(introduction).toHaveLength(4);
    expect(introduction).toContain(
      "乐程软件工作室自 2010 年 6 月创立以来，已在软件开发和作品开发领域深耕了十余年。我们是学生科研领域的佼佼者，致力于多方向的技术学习与人才培养，涵盖全栈开发、Agent 开发、机器学习、游戏开发等多个领域。",
    );
    expect(introduction).toContain(
      "通过乐程的学习与培养，部分成员在电子科大、川大等知名大学继续深造。也有部分成员就职于字节、腾讯、阿里、美团等互联网行业领军企业。我们将本着\"学以致用，服务学校，走向社会\"的宗旨，用优秀的软件和细致的服务为我们的数字化生活提供便利，也为团队和每位成员带来更好的学习空间与成长机会。",
    );
    expect(introduction).toContain(
      "加入我们，你收获的不只是技术上的战友，还有一整套‘读研保驾护航’的隐形资源——这里有直系学长学姐沉淀多年的复试真题库与导师避坑指南，有能写进简历、让面试官眼前一亮的硬核项目经历，更有考研冲刺期团队为你主动减负、集体督学的陪伴机制。我们不画‘轻松上岸’的大饼，只把历届传承下来的信息差和实战底气给到你，让你从大一起就站在学习的‘快车道’上，而不是到大四才独自摸黑赶路。我们以历届传承的底气，助力每一位成员在深造与就业路上少走弯路，更有方向、更有信心地迈向自己的目标。",
    );
  });

  it("uses image-specific descriptions for the About photo wall", () => {
    const altTexts = teamInfo.aboutImages.map((image) => image.alt);

    expect(altTexts).toEqual([
      "团队成员围坐火锅聚餐",
      "团队成员乘坐商场扶梯",
      "夜间树下的团队成员与小狗合影",
      "身穿学士服的团队成员在校园合影",
      "成员在橙白热气球装置前集体合影",
      "户外树下手持风车与礼物的团队成员合影",
    ]);
  });
});
