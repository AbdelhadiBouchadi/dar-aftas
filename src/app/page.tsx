import { Day } from "@/components/sections/Day";
import { Enquire } from "@/components/sections/Enquire";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Points } from "@/components/sections/Points";
import { Rooms } from "@/components/sections/Rooms";
import { Table } from "@/components/sections/Table";

/**
 * Fully static Server Component. Every section renders on the server; the
 * only client JavaScript on the page is the isolated motion layer.
 *
 * Section order is an argument, not a template: the ocean's conditions first
 * (the thesis), then the house, the rooms, the waves, the shape of a day,
 * the table, and only then the ask.
 */
export default function HomePage(): React.JSX.Element {
  return (
    <>
      <Hero />
      <Manifesto />
      <Rooms />
      <Points />
      <Day />
      <Table />
      <Enquire />
    </>
  );
}
