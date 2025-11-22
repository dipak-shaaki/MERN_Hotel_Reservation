import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const MenuPage = () => {
    const [activeCategory, setActiveCategory] = useState('All Items');

    // Define menu items with prices
    const menuItems = [
        {
            id: 1,
            name: "Truffle Mushroom Risotto",
            description: "Arborio rice with wild mushrooms, white truffle oil, and parmesan",
            price: 28.99,
            category: "Main Course",
            image: "/dinner3.png"
        },
        {
            id: 2,
            name: "Herb-Crusted Lamb Chops",
            description: "New Zealand lamb with rosemary, thyme, and mint jus",
            price: 36.99,
            category: "Main Course",
            image: "/dinner1.jpeg"
        },
        {
            id: 3,
            name: "Pan-Seared Atlantic Salmon",
            description: "Fresh salmon with lemon butter sauce and seasonal vegetables",
            price: 26.99,
            category: "Main Course",
            image: "/dinner2.png"
        },
        {
            id: 4,
            name: "Traditional Italian Lasagna",
            description: "Homemade pasta with bolognese sauce and béchamel",
            price: 22.99,
            category: "Main Course",
            image: "/dinner5.png"
        },
        {
            id: 5,
            name: "Mediterranean Sea Bass",
            description: "Fresh sea bass with olive oil, tomatoes, and herbs",
            price: 32.99,
            category: "Main Course",
            image: "/dinner6.png"
        },
        {
            id: 6,
            name: "Creamy Lobster Bisque",
            description: "Rich lobster soup with cognac and fresh cream",
            price: 16.99,
            category: "Appetizer",
            image: "/dinner4.png"
        },
        {
            id: 7,
            name: "Smoked Salmon Benedict",
            description: "Poached eggs, smoked salmon, and hollandaise on English muffin",
            price: 18.99,
            category: "Breakfast",
            image: "/breakfast1.png"
        },
        {
            id: 8,
            name: "Premium Angus Beef Burger",
            description: "Grass-fed beef with aged cheddar, bacon, and truffle aioli",
            price: 24.99,
            category: "Lunch",
            image: "/lunch1.png"
        },
        {
            id: 9,
            name: "Chocolate Soufflé",
            description: "Warm chocolate soufflé with vanilla ice cream",
            price: 12.99,
            category: "Dessert",
            image: "/dinner3.png"
        },
        {
            id: 10,
            name: "Tiramisu Classico",
            description: "Traditional Italian dessert with espresso and mascarpone",
            price: 10.99,
            category: "Dessert",
            image: "/dinner4.png"
        },
        {
            id: 11,
            name: "Caesar Salad",
            description: "Romaine lettuce, parmesan, croutons, and anchovy dressing",
            price: 14.99,
            category: "Appetizer",
            image: "/dinner2.png"
        },
        {
            id: 12,
            name: "Grilled Octopus",
            description: "Tender octopus with paprika, olive oil, and lemon",
            price: 19.99,
            category: "Appetizer",
            image: "/dinner1.jpeg"
        }
    ];

    // Get unique categories
    const categories = ['All Items', ...new Set(menuItems.map(item => item.category))];

    // Filter items based on active category
    const filteredItems = activeCategory === 'All Items'
        ? menuItems
        : menuItems.filter(item => item.category === activeCategory);

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
                    <div className="menu-items-container">
                        {filteredItems.map(item => (
                            <div className="menu-item-card" key={item.id}>
                                <div className="menu-item-image">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="menu-item-details">
                                    <div className="menu-item-header">
                                        <h3 className="menu-item-name">{item.name}</h3>
                                        <span className="menu-item-price">${item.price.toFixed(2)}</span>
                                    </div>
                                    <p className="menu-item-description">{item.description}</p>
                                    <button className="add-to-cart-btn">Add to Cart</button>
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