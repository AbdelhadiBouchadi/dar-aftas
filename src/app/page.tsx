import { Day } from '@/components/sections/Day';
import { Enquire } from '@/components/sections/Enquire';
import { Hero } from '@/components/sections/Hero';
import { Manifesto } from '@/components/sections/Manifesto';
import { Packages } from '@/components/sections/Packages';
import { Points } from '@/components/sections/Points';
import { Table } from '@/components/sections/Table';
import { Testimonials } from '@/components/sections/Testimonials';

/**
 * Fully static Server Component. Every section renders on the server; the
 * only client JavaScript on the page is the isolated motion layer.
 *
 * Section order is an argument, not a template: the ocean's conditions first
 * (the thesis), then the school, what it sells, the waves it sells access to,
 * the shape of a day, the table — and only then other people's word for it,
 * immediately before the ask, where proof does the most work.
 */
export default function HomePage(): React.JSX.Element {
  return (
    <>
      <Hero />
      <Manifesto />
      <Packages />
      <Points />
      <Day />
      <Table />
      <Testimonials />
      <Enquire />
    </>
  );
}
