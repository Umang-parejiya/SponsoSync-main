import React from 'react';

const Home = () => {
  return (
    <div className="bg-white text-black min-h-screen flex flex-col items-center">
      {/* Hero Section */}
      <header className="w-full text-center py-20 px-6 bg-gray-100">
        <h1 className="text-5xl font-bold mb-4 text-black">Welcome to SponsoSync</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Connect with top sponsors and elevate your events to the next level. Join us today and explore unlimited sponsorship opportunities!
        </p>
        <a 
          href="/login" 
          className="mt-6 inline-block bg-blue-700 px-6 py-3 rounded-lg text-lg font-semibold text-white hover:bg-blue-900 transition-all duration-300"
        >
          Get Started
        </a>
      </header>

      {/* Add Event or Sponsorship Section */}
      <section className="w-full py-16 px-6 text-center bg-white">
        <h2 className="text-3xl font-semibold mb-4 text-black">Get Involved with Sponsorships and Events</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
          Whether you want to host an event or offer sponsorship opportunities, we make it easy for you. Start by selecting an option below:
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="p-8 bg-blue-100 rounded-xl shadow-md border border-blue-300 transition-all duration-300 hover:shadow-lg hover:scale-105 flex flex-col items-center">
            <h3 className="text-2xl font-semibold mb-2 text-black">Add an Event</h3>
            <p className="text-gray-800 mb-4">Create and manage your event, find sponsors, and maximize visibility.</p>
            <a 
              href="/addevent" 
              className="bg-blue-700 px-6 py-3 rounded-lg text-lg font-semibold text-white hover:bg-blue-900 transition-all duration-300"
            >
              Add Event
            </a>
          </div>
          <div className="p-8 bg-green-100 rounded-xl shadow-md border border-green-300 transition-all duration-300 hover:shadow-lg hover:scale-105 flex flex-col items-center">
            <h3 className="text-2xl font-semibold mb-2 text-black">Add a Sponsorship</h3>
            <p className="text-gray-800 mb-4">Offer sponsorships and collaborate with event organizers to boost brand presence.</p>
            <a 
              href="sponser" 
              className="bg-green-700 px-6 py-3 rounded-lg text-lg font-semibold text-white hover:bg-green-900 transition-all duration-300"
            >
              Add Sponsorship
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 px-6 text-center bg-gray-50">
        <h2 className="text-3xl font-semibold mb-6 text-black">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[ 
            { 
              title: "Free of Cost", 
              desc: "Get and provide sponsorships with zero platform charges.", 
              img: "/money.png" 
            },
            { 
              title: "Easy Collaboration", 
              desc: "Seamless communication and partnership management with our tools.", 
              img: "/collabration.png" 
            },
            { 
              title: "Wide Network", 
              desc: "Connect with sponsors from various industries and secure the best deals.", 
              img: "/wide.png" 
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="p-6 bg-gray-200 rounded-xl shadow-md border border-gray-300 transition-all duration-300 hover:shadow-lg hover:scale-105 flex flex-col items-center"
            >
              <div className="w-20 h-20 flex justify-center items-center bg-white rounded-full border-4 border-blue-700 shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300">
                <img src={feature.img} alt={feature.title} className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mt-4 text-black">{feature.title}</h3>
              <p className="text-gray-800 mt-2">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  ); 
};

export default Home;
