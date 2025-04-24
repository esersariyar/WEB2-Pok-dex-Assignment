import { Link } from 'react-router-dom';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-container">
      <h1>About This Pokédex</h1>
      
      <div className="about-content">
        <p>
          This Pokédex application was created as part of the Web Development 2 course assignment.
          It uses the <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer">PokéAPI</a> to 
          fetch and display information about Pokémon.
        </p>
        
        <p>
          The application features:
        </p>
        
        <ul>
          <li>A list of Pokémon with pagination</li>
          <li>Detailed information about each Pokémon</li>
          <li>Multiple pages using React Router</li>
          <li>Built with React and Vite</li>
        </ul>
        
        <p>
          Navigate back to the Pokédex to explore the world of Pokémon!
        </p>
        
        <div className="developer-info">
          <p>Developed by: <span className="developer-name">Eser Sarıyar</span></p>
        </div>
        
        <Link to="/" className="back-button">Return to Pokédex</Link>
      </div>
    </div>
  );
};

export default About;
