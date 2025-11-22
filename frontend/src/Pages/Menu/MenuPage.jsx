import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { data } from '../../restApi.json';

const MenuPage = () => {
    const [activeCategory, setActiveCategory] = useState('All Items');

    // Get unique categories
    const categories = ['All Items', ...new Set(data[0].dishes.map(dish => dish.category))];

    // Filter dishes based on active category
    const filteredDishes = activeCategory === 'All Items'
        ? data[0].dishes
        : data[0].dishes.filter(dish => dish.category === activeCategory);

    return (
        <>
            <Navbar />
            <section className="menu-page-section">
                <div className="container">
                    <div className="menu-header">
                        <h1 className="heading">OUR EXCLUSIVE MENU</h1>
                        <p>Discover our carefully curated selection of exquisite dishes crafted by our master chefs</p>
                    </div>
                    <div className="menu-categories">
                        {categories.map((category, index) => (
                            <button
                                key={index}
                                className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    <div className="dishes_container">
                        {filteredDishes.map(element => (
                            <div className="card" key={element.id}>
                                <img src={element.image} alt={element.title} />
                                <div className="card-content">
                                    <h3>{element.title}</h3>
                                    <button className="category-tag">{element.category}</button>
                                    <div className="price-rating">
                                        <span className="price">$24.99</span>
                                        <div className="rating">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className="star">★</span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="description">Fresh ingredients expertly prepared to deliver an unforgettable culinary experience.</p>
                                    <button className="add-to-cart">Add to Cart</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default MenuPage;