import { getSeoDetails } from "@/utils/getSEO";
import { NextSeo } from "next-seo";

export default function About() {
  const SEO = { ...getSeoDetails({ title: "About Us" }) };
  return (
    <>
      <NextSeo {...SEO} />
      <section className="p-10">
        <h1 className="text-xl text-black">About Us</h1>
        <p className="mb-4">
          Welcome to Right Diversion! At Right Diversion, we believe that travel
          is not just a journey from one place to another, but a
          transformational experience that enriches our lives. We are passionate
          about exploring the world and sharing our love for travel with fellow
          wanderers. Our website serves as a hub for travel enthusiasts,
          providing detailed information about the top places to visit,
          inspiring travel stories, and a platform for travelers to connect and
          share their experiences.
        </p>
        <h1 className="text-xl text-black">Inspiration for Travelers</h1>
        <p className="mb-4">
          Are you looking for your next adventure? Right Diversion is here to
          ignite your wanderlust and guide you towards the most captivating
          destinations on the planet. Whether you seek the pristine beaches of
          Bali, the awe-inspiring architecture of Rome, the exotic wildlife of
          the Amazon rainforest, or the bustling streets of Tokyo, our website
          is your one-stop resource for all things travel.
        </p>
        <h1 className="text-xl text-black">Discover Top Places</h1>
        <p className="mb-4">
          We understand that planning a trip can be overwhelming, especially
          when there are countless destinations to choose from. That's why we
          have curated a collection of the world's top places to visit. Our team
          of travel experts tirelessly researches and reviews destinations to
          provide you with comprehensive and up-to-date information. From famous
          landmarks to hidden gems, we strive to bring you a diverse range of
          options to suit every traveler's taste.
        </p>
        <h1 className="text-xl text-black">Detailed Information</h1>
        <p className="mb-4">
          We believe that knowledge is key to a successful journey. When you
          visit Right Diversion, you can expect to find detailed information
          about each destination. Our articles cover various aspects such as
          local attractions, historical significance, cultural highlights,
          cuisine, accommodation options, transportation, and more. We provide
          insights that go beyond the surface, allowing you to truly immerse
          yourself in the essence of each place before you embark on your
          adventure.
        </p>
        <h1 className="text-xl text-black">Traveler Experiences</h1>
        <p className="mb-4">
          What sets Right Diversion apart is our commitment to fostering a
          vibrant community of travelers. We believe that the best advice comes
          from those who have already experienced a destination firsthand. On
          our platform, you can read personal travel stories, tips, and
          recommendations shared by fellow globetrotters. Whether you're a
          seasoned explorer or embarking on your first journey, the collective
          wisdom of our community will help you make the most of your travel
          experiences.
        </p>
        <h1 className="text-xl text-black">Connect and Share</h1>
        <p className="mb-4">
          Traveling is not just about exploring new places; it's also about
          forging connections and creating lasting memories. Right Diversion
          provides a platform for travelers to connect with like-minded
          individuals, share their travel stories, and exchange valuable
          insights. Join our community, engage in discussions, and build
          friendships with fellow adventurers from around the world. Together,
          we can inspire and support each other on our journeys.
        </p>
        <h1 className="text-xl text-black">Quality and Reliability</h1>
        <p className="mb-4">
          At Right Diversion, we take pride in delivering high-quality and
          reliable information to our users. We understand that your travel
          plans are important, and we strive to ensure that the details we
          provide are accurate and trustworthy. Our team of experts conducts
          thorough research and verification to bring you the most reliable
          information available. You can count on us to be your trusted
          companion in planning your next travel adventure.
        </p>
        <h1 className="text-xl text-black">
          Explore, Experience, and Embrace the World
        </h1>
        <p className="mb-4">
          Right Diversion is more than just a travel website; it's a celebration
          of the beauty and diversity of our world. We invite you to join us on
          a journey of exploration, to experience the wonders of different
          cultures, and to embrace the extraordinary moments that travel offers.
          Whether you're seeking inspiration, practical advice, or a community
          of fellow travelers, Right Diversion is here to guide you every step
          of the way.
        </p>
        <p className="mb-4">
          Start your travel adventure with us and let Right Diversion be your
          compass in discovering the world's most remarkable places. Together,
          let's make every journey an unforgettable experience.
        </p>
      </section>
    </>
  );
}
