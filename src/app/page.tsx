import { Enquire } from "@/components/sections/Enquire";
import { Fleet } from "@/components/sections/Fleet";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { NightRides } from "@/components/sections/NightRides";
import { Ride } from "@/components/sections/Ride";
import { Routes } from "@/components/sections/Routes";

/**
 * Fully static Server Component. Every section renders on the server; the
 * only client JavaScript on the page is the isolated motion layer.
 *
 * Section order is an argument, not a template: the conditions first (the
 * thesis — this is a business the weather decides), then who runs it, what
 * they rent, where it goes, the shape of a ride, the version of it after dark,
 * and only then the ask.
 */
export default function HomePage(): React.JSX.Element {
  return (
    <>
      <Hero />
      <Manifesto />
      <Fleet />
      <Routes />
      <Ride />
      <NightRides />
      <Enquire />
    </>
  );
}
