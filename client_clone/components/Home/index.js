import Banner from "./Banner";
import NearbyLocation from "./NearbyLocation";

export default function Home({thingsToDo}) {
  
  return (
    <>
      <section>
        <Banner />
      </section>

      <div className="grid grid-cols-4">
        <div  className="px-10 col-span-3">
          <section className="py-5 pt-10">
            <h1 className="text-xl font-semibold uppercase">Places near me</h1>
            <NearbyLocation list={thingsToDo}/>
          </section>

          <section className="py-5">
            <h1 className="text-xl font-semibold uppercase">Places to visit in upcoming months</h1>
            {/* <NearbyLocation /> */}
          </section>

          <section className="py-5">
            <h1 className="text-xl font-semibold uppercase">Themes you can explore</h1>
            {/* <NearbyLocation /> */}
          </section>
        </div>
        <aside className="px-10">123123</aside>
      </div>
    </>
  );
}
