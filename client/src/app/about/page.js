

export default function About(props) {
console.log(props,"we are in about page")
  return (
    <h1>About</h1>
  );
}


// This gets called on every request
export async function getServerSideProps() {
  return { props: { data:'asdasdasd' } }
}