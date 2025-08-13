import Navbar from '@/components/Navbar';
import HeroPro from '@/components/HeroPro';
import AnimatedLogos from '@/components/AnimatedLogos';
import FeatureCards from '@/components/FeatureCards';
import ReviewsMarquee from '@/components/ReviewsMarquee';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroPro />
      <AnimatedLogos />
      <FeatureCards />
      <ReviewsMarquee />
      <CTA />
      <Footer />
    </main>
  );
}
