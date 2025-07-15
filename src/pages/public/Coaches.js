// src/pages/public/Coaches.js
import React, { useState, useEffect } from 'react';
import { Star, MapPin, BookOpen, Users, Search, Filter } from 'lucide-react';

const Coaches = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Mock data - replace with API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCoaches([
        {
          id: 1,
          name: "Sarah Johnson",
          expertise: "Web Development",
          bio: "Full-stack developer with 8+ years experience in React and Node.js",
          rating: 4.8,
          students: 1250,
          seminars: 25,
          location: "San Francisco, CA",
          avatar: null,
          categories: ["Web Development", "JavaScript", "React"]
        },
        {
          id: 2,
          name: "Michael Chen",
          expertise: "Data Science",
          bio: "ML engineer and data scientist specializing in Python and AI",
          rating: 4.9,
          students: 980,
          seminars: 18,
          location: "New York, NY",
          avatar: null,
          categories: ["Data Science", "Python", "Machine Learning"]
        },
        {
          id: 3,
          name: "Emily Rodriguez",
          expertise: "Digital Marketing",
          bio: "Marketing strategist with expertise in social media and SEO",
          rating: 4.7,
          students: 850,
          seminars: 22,
          location: "Austin, TX",
          avatar: null,
          categories: ["Digital Marketing", "SEO", "Social Media"]
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = [
    "Web Development",
    "Data Science", 
    "Digital Marketing",
    "Design",
    "Finance",
    "Personal Development",
    "Business",
    "Technology"
  ];

  const filteredCoaches = coaches.filter(coach => {
    const matchesSearch = coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coach.expertise.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || coach.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Expert Coaches
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn from industry professionals who are passionate about sharing their knowledge
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search coaches by name or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Coaches Grid */}
        {filteredCoaches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoaches.map((coach) => (
              <div key={coach.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Coach Avatar and Basic Info */}
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-semibold text-blue-600">
                        {coach.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{coach.name}</h3>
                      <p className="text-blue-600 font-medium">{coach.expertise}</p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {coach.bio}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-semibold text-gray-900">{coach.rating}</span>
                      </div>
                      <p className="text-xs text-gray-600">Rating</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold text-gray-900">{coach.students}</span>
                      </div>
                      <p className="text-xs text-gray-600">Students</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <BookOpen className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-gray-900">{coach.seminars}</span>
                      </div>
                      <p className="text-xs text-gray-600">Seminars</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center text-gray-600 text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{coach.location}</span>
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {coach.categories.slice(0, 2).map((category) => (
                      <span
                        key={category}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                    {coach.categories.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{coach.categories.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No coaches found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Coaches;