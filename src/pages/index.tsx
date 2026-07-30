import dynamic from "next/dynamic";
import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import Achievements from "@/components/Achievements";
import Directions from "@/components/Directions";
import Recruitment from "@/components/Recruitment";
import Footer from "@/components/Footer";
import DeferredSection from "@/components/DeferredSection";

const Mission = dynamic(() => import("@/components/Mission"), { ssr: false });
const Timeline = dynamic(() => import("@/components/Timeline"), { ssr: false });
const Alumni = dynamic(() => import("@/components/Alumni"), { ssr: false });

export default function Home() {
  return (
    <Layout>
      <Hero />
      <DeferredSection id="mission" minHeight="100svh">
        {() => <Mission id={null} />}
      </DeferredSection>
      <Achievements />
      <Directions />
      <DeferredSection id="alumni" minHeight="100svh">
        {() => <Alumni />}
      </DeferredSection>
      <DeferredSection id="history" minHeight="100svh">
        {() => <Timeline id={null} />}
      </DeferredSection>
      <Recruitment />
      <Footer />
    </Layout>
  );
}
