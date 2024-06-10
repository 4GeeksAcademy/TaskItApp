import React from 'react';

const About = () => {
    return (
        <div className="container mt-6 mb-5">
            <div className="row">
                <div className="col-12 col-md-7 order-1">
                    <h1 className="display-1 fw-bold">About</h1>
                    
                    <p className="fs-4 text-muted">
                        At Task It App, we're passionate about simplifying everyday tasks and fostering community connections. Founded by a team of three dedicated individuals, all students
                        of a rigorous full-stack development bootcamp, we strive to create a platform that empowers users to get things done efficiently and reliably.
                    </p>

                    <h2 className="text-secondary mt-5">Meet Our Team</h2>

                    <h3 className="text-secondary mt-5">Blondy</h3>

                    <p className="fs-4 text-muted">
                        With a background in video game development and a deep understanding of programming and computer science, she brings a unique perspective to our team.
                    </p>

                    <h3 className="text-secondary mt-2">Ares</h3>

                    <p className="fs-4 text-muted">
                        A versatile full-stack developer with a knack for backend architecture. His attention to detail and problem-solving skills ensure the platform runs smoothly and efficiently.
                    </p>

                    <h3 className="text-secondary mt-2">Fali</h3>

                    <p className="fs-4 text-muted">
                        A creative force with a passion for design and user experience. His expertise in UI/UX design elevates the platform's aesthetics and usability, making it a pleasure to use for our users.
                    </p>
                </div>
                
                <div className="col-12 col-md-5 order-2">
                    <div className="card h-100">
                        <img src="https://res-console.cloudinary.com/doojwu2m7/media_explorer_thumbnails/b79ce5079aaec66e7597064f9eba91fd/detailed" className="card-img-top" alt="Team" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
