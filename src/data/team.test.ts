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

  it("stores the supplied three-paragraph studio introduction", () => {
    const introduction = (
      teamInfo.content as { introduction?: readonly string[] }
    ).introduction;

    expect(introduction).toEqual([
      "乐程软件工作室自 2010 年 6 月创立以来，已在软件开发和作品开发领域深耕了十余年。我们是学生科研领域的佼佼者，致力于多方向的技术学习与人才培养，涵盖前后端开发、算法竞赛、机器学习、游戏开发等多个领域。",
      "团队目前有成员30余人，采取每周28小时考勤制度，定期开展例会和学习交流促进团队发展，形成良好学风。同时也积极组织参与各级别比赛，团队项目曾多次成功获学院立项，更获省、国赛奖项百余项。大家因对技术的热爱相聚于此，在尊重和包容的团队氛围中，积极分享想法、大胆展现自我，携手攻克一个又一个技术难题。",
      "通过乐程的学习与培养，部分成员保研至电子科大、川大等知名大学继续深造。也有部分成员就职于字节、腾讯、阿里、美团等互联网行业领军企业。我们将本着\"学以致用，服务学校，走向社会\"的宗旨，用优秀的软件和细致的服务为我们的数字化生活提供便利，也为团队和每位成员带来更好的学习空间与成长机会。",
    ]);
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
