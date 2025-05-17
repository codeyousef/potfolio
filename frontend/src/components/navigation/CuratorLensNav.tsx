import { motion, AnimatePresence } from 'framer-motion';
import { useAethelframeStore, CanvasId } from '../../store/useAethelframeStore';

const menuItems: { id: CanvasId; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'services', label: 'Services' },
    { id: 'journal', label: 'Journal' },
    { id: 'contact', label: 'Contact' },
];

const CuratorLensNav = () => {
    const { activeCanvasId, isCuratorMenuOpen, toggleCuratorMenu, setActiveCanvas, closeCuratorMenu } = useAethelframeStore();

    // Function to handle menu item click
    const handleMenuItemClick = (id: CanvasId) => {
        setActiveCanvas(id);
        closeCuratorMenu();
    };

    // Animation variants
    const menuVariants = {
        hidden: {
            opacity: 0,
            y: 10,
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.07,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    // The orbiting dots around the icon
    const orbitingDots = Array(3).fill(null);

    return (
        <div className="curator-lens">
            {/* Curator Lens Icon */}
            <motion.div
                className="curator-lens-icon"
                onClick={toggleCuratorMenu}
                whileTap={{ scale: 0.95 }}
                whileHover={{ boxShadow: "0 0 15px rgba(226, 200, 160, 0.3)" }}
            >
                {/* Icon Shape - Plus/Cross that animates */}
                <motion.div
                    className="absolute w-5 h-0.5 bg-highlight-color"
                    animate={{
                        rotate: isCuratorMenuOpen ? 45 : 0,
                        width: isCuratorMenuOpen ? 18 : 20
                    }}
                    transition={{ duration: 0.3 }}
                />
                <motion.div
                    className="absolute w-5 h-0.5 bg-highlight-color"
                    animate={{
                        rotate: isCuratorMenuOpen ? -45 : 90,
                        width: isCuratorMenuOpen ? 18 : 20
                    }}
                    transition={{ duration: 0.3 }}
                />

                {/* Orbiting Dots */}
                {orbitingDots.map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full bg-highlight-color/70"
                        animate={{
                            x: `${Math.cos(2 * Math.PI * (i / orbitingDots.length)) * 8}px`,
                            y: `${Math.sin(2 * Math.PI * (i / orbitingDots.length)) * 8}px`,
                        }}
                        transition={{
                            duration: 3,
                            ease: "linear",
                            repeat: Infinity,
                            delay: i * (3 / orbitingDots.length)
                        }}
                        style={{
                            opacity: isCuratorMenuOpen ? 0 : 0.7
                        }}
                    />
                ))}
            </motion.div>

            {/* Curator Menu */}
            <AnimatePresence>
                {isCuratorMenuOpen && (
                    <motion.div
                        className="curator-menu open"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={menuVariants}
                    >
                        {menuItems.map((item) => (
                            <motion.div
                                key={item.id}
                                className={`menu-item ${activeCanvasId === item.id ? 'active' : ''}`}
                                onClick={() => handleMenuItemClick(item.id)}
                                variants={itemVariants}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.97 }}
                            >
                <span className="text-xs font-roboto-mono opacity-60">
                  {menuItems.indexOf(item) + 1}/{menuItems.length}
                </span>
                                <span>{item.label}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CuratorLensNav;
