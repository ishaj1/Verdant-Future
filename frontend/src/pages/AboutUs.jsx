import Header from "../components/Header";

export default function AboutUs() {
  return (
    <>
      <Header />
      <div className="relative h-screen bg-customGreen-50">
        <div className="flex justify-center items-start py-10">
          <div className="font-montserrat w-full max-w-5xl p-10 bg-white shadow-md rounded-md">
            <h1 className="text-center p-2 font-semibold text-2xl">About Us</h1>
            <p className="text-lg text-justify">
              Climate change is a global challenge, endangering the planet
              through rising sea levels, warming winters, and melting icebergs.
              To take the initiative in fighting climate change, we provide an
              online platform in collaboration with environmental agencies,
              enabling companies to assess their progress toward environmental
              sustainability. Through data-driven analysis and encouraging
              investments in emissions reduction projects, this platform
              empowers companies to make sustainable decisions in combating
              climate change.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
