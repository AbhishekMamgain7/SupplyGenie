import React from 'react';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import './manager.css';
const Manager = () =>{
    return(
        <div className="manager-page">
        <motion.div
        type="button"
        name="inventory"
        placeholder="Inventory"
        whileHover = {{ scale: 1.05 }}
        whileTap = {{ scale: 0.95 }}
        className="inventory"
        ><p className="options"><Link to ="/Inventory/Inventory">Inventory</Link>
        </p>
        </motion.div>
        <motion.div
        type="button"
        name="stocks"
        placeholder="Stock"
        whileHover = {{ scale: 1.05 }}
        whileTap = {{ scale: 0.95 }}
        className="stocks"
        >
        <p className="options"><Link to ="/Stocks/Stocks">Stocks</Link></p>
        </motion.div>
        </div>
    );
};
export default Manager;