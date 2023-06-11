import Link from "next/link";
import Banner from "./Banner";
import NearbyLocation from "./NearbyLocation";

export default function Home({ thingsToDo = [], states = [] }) {
  return (
    <>
      <section>
        <Banner />
      </section>

      <div className="grid grid-cols-4">
        <div className="px-10 col-span-3">
          <section className="py-5 pt-10">
            <div className="grid gap-4 grid-cols-6">
              {states.map((item) => (
                <Link
                  href={`/places/${
                    item.uid
                  }+place+to+visit+in+${item.state_name.replace(/ /g, "+")}`}
                >
                  <div className="col-span-1 text-center" key={item.uid}>
                    <img
                      className="w-28 h-28 my-0 mx-auto rounded-full hover:shadow-md border"
                      src={"/images/placeholder-image.jpg"}
                      alt={item.state_name}
                    />
                    <p className="mt-1">{item.state_name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="py-5 pt-10">
            <h1 className="text-xl font-semibold capitalize">Places near me</h1>
            <NearbyLocation list={thingsToDo} />
          </section>

          <section className="py-5">
            <h1 className="text-xl font-semibold capitalize">
              Places to visit in upcoming months
            </h1>
            {/* <NearbyLocation /> */}
          </section>

          <section className="py-5">
            <h1 className="text-xl font-semibold capitalize">
              Themes you can explore
            </h1>
            {/* <NearbyLocation /> */}
          </section>
        </div>
        <aside className="px-10">123123</aside>
      </div>
    </>
  );
}
