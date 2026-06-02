import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.5, duration: 1.5 } },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Profile = ({ user }) => (
  <motion.div className="flex flex-col space-y-8"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    {['name', 'email', 'phone', 'address'].map(field => (
      <motion.div className="flex flex-row space-x-16" variants={childVariants} key={field}>
        <div className="flex item-center">
          <label htmlFor={field} className="text-sm font-semibold w-20">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
          <input
            id={field}
            type={field}
            className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
            value={user[field]}
            readOnly
          />
        </div>
      </motion.div>
    ))}
  </motion.div>
);

export default Profile;
