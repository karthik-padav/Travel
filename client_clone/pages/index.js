import Image from "next/image";
import HomePage from "@/components/Home";
import { Inter } from 'next/font/google'
import { getThingsToDo } from "@/apollo/services";

const inter = Inter({ subsets: ["latin"] });

export default function Home({thingsToDo}) {
  return <HomePage thingsToDo={thingsToDo}/>
}

export async function getServerSideProps(context) {
  
  const thingsToDo = await getThingsToDo();
  return {
    props: {thingsToDo}, 
  }
}
