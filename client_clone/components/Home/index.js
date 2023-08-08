import Link from "next/link";
import Banner from "./Banner";
import HorizontalCarouse from "./HorizontalCarouse";
import Image from "next/image";

export default function Home({
  thingsToDo = [],
  nearByPlaces = [],
  states = [],
}) {
  const placeholderImage = "/images/placeholder-image.jpg";
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
                  key={item.uid}
                  href={`/places/${
                    item.uid
                  }+place+to+visit+in+${item.state_name.replace(/ /g, "+")}`}
                >
                  <div className="col-span-1 text-center">
                    <Image
                      className="w-28 h-28 my-0 mx-auto rounded-full hover:shadow-md border"
                      width={1000}
                      height={1000}
                      quality={100}
                      object-fit="fill"
                      alt={item.state_name}
                      src={item.banner_image || placeholderImage}
                    />

                    <p className="mt-1">{item.state_name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="py-5 pt-10">
            <h1 className="text-xl text-black mb-2 capitalize">
              Places near me
            </h1>
            <HorizontalCarouse list={nearByPlaces} />
          </section>

          <section className="py-5">
            <h1 className="text-xl text-black mb-2 capitalize">
              Places to visit in upcoming months
            </h1>
            <HorizontalCarouse list={thingsToDo} />
          </section>

          <section className="py-5">
            <h1 className="text-xl text-black mb-2 capitalize">
              Themes you can explore
            </h1>
            <HorizontalCarouse list={thingsToDo} />
          </section>
        </div>
        <aside className="px-10">123123</aside>
      </div>
    </>
  );
}
