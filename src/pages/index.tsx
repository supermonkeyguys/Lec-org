import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import Mission from "@/components/Mission";
import Achievements from "@/components/Achievements";
import Directions from "@/components/Directions";
import Members from "@/components/Members";
import Alumni from "@/components/Alumni";
import Timeline from "@/components/Timeline";
import Recruitment from "@/components/Recruitment";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Mission />
      <Achievements />
      <Directions />
      <Members />
      <Alumni />
      <Timeline />
      <Recruitment />
      <Footer />
    </Layout>
  );
}
