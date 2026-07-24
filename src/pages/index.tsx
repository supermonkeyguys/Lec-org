import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import Mission from "@/components/Mission";
import Members from "@/components/Members";
import Alumni from "@/components/Alumni";
import Timeline from "@/components/Timeline";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Mission />
      <Members />
      <Alumni />
      <Timeline />
      <Footer />
    </Layout>
  );
}
