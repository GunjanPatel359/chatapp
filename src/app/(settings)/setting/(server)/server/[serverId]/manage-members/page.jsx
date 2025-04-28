"use client";

import React, { useState, useEffect } from 'react';
import { MoreVertical, UserPlus, User, Shield, Bell, Search, ArrowDown, ArrowUp } from "lucide-react";
import { serverJoinedMembersList } from '@/actions/server';
import { useParams } from 'next/navigation';

// MemberRow Component
const MemberRow = ({ member }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleAddRole = () => {
    alert(`Add role to ${member.name}`);
    setIsDropdownOpen(false);
  };

  const handleKickMember = () => {
    alert(`Kicked ${member.name}`);
    setIsDropdownOpen(false);
  };

  return (
    <tr className="border-b border-gray-100">
      <td className="py-4 pl-2">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 rounded-full ring-2 ring-white/10">
            {member.imageUrl ? (
              <img
                src={member.imageUrl}
                alt={member.name}
                className="h-full w-full rounded-full object-cover mx-2"
              />
            ) : (
              <div className="h-full w-full rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-sm">
                {getInitials(member.name)}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm text-gray-900">{member.name}</span>
            <span className="text-xs text-gray-500"> @{member.user.username}</span>
          </div>
        </div>
      </td>
      <td className="py-4">
        <div className="flex items-center gap-1.5">
          {member.roles.map((role, idx) => (
            <span
              key={idx}
              className={`px-2 py-0.5 text-xs rounded ${role.toLowerCase() === 'admin'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}
            >
              <Shield className="h-3 w-3 mr-1 inline" />
              {role}
              {idx === 0 && member.roleCount > 1 && <span className="ml-1">+{member.roleCount - 1}</span>}
            </span>
          ))}
        </div>
      </td>
      <td className="py-4">
        <div className="flex items-center justify-end gap-1 pr-3">
          <User className={`h-4 w-4 ${member.messages ? 'text-indigo-500' : 'text-gray-400'}`} />
        </div>
      </td>
      <td className="py-4 pr-4">
        <div className="relative flex items-center justify-end">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </button>
          {isDropdownOpen && (
            <div className="absolute top-10 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <button
                onClick={handleAddRole}
                className="flex items-center gap-2 px-4 py-2 text-gray-900 hover:bg-gray-100 w-full text-left"
              >
                <UserPlus className="h-4 w-4" />
                <span className='whitespace-nowrap'>Add Role</span>
              </button>
              <button
                onClick={handleKickMember}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left"
              >
                <span className='whitespace-nowrap'>Kick Member</span>
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

// TableHeader Component
const TableHeader = ({ label, sortable, sortKey, currentSort, sortDirection, onSort }) => {
  const handleClick = () => {
    if (sortable && sortKey && onSort) {
      onSort(sortKey);
    }
  };

  return (
    <th className="px-4 py-3 text-left">
      <div
        className={`flex items-center gap-1 ${sortable ? 'cursor-pointer hover:text-gray-900' : ''}`}
        onClick={handleClick}
      >
        <span className="text-sm text-gray-600">{label}</span>
        {sortable && sortKey === currentSort && (
          sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 text-gray-600" /> : <ArrowDown className="h-4 w-4 text-gray-600" />
        )}
      </div>
    </th>
  );
};

// ManageMembers Component
const ManageMembers = () => {
  const params = useParams();
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Fetch members from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await serverJoinedMembersList(params.serverId); // replace with your endpoint
        console.log(res);
        setMembers(res.members);
        setFilteredMembers(sortMembers(res.members, sortBy, sortDirection)); // Sorting immediately after fetching
      } catch (error) {
        console.error("Failed to fetch members:", error);
      }
    };

    fetchMembers();
  }, [params.serverId, sortBy, sortDirection]);

  useEffect(() => {
    const filtered = members.filter(member =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.tag?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMembers(sortMembers(filtered, sortBy, sortDirection));
  }, [searchQuery, members, sortBy, sortDirection]);

  const sortMembers = (data, key, direction) => {
    return [...data].sort((a, b) => {
      const aValue = a[key]?.toLowerCase?.() || '';
      const bValue = b[key]?.toLowerCase?.() || '';
      return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
  };

  const handleSort = (key) => {
    const newDirection = sortBy === key && sortDirection === 'desc' ? 'asc' : 'desc';
    setSortBy(key);
    setSortDirection(newDirection);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-indigo-500">Manage Members</h1>
          <div className="flex gap-3">
            <div className="relative rounded-md flex items-center overflow-hidden border border-gray-300">
              <Search className="absolute left-3 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search by username or id"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 h-10 border-0 bg-transparent text-gray-900"
              />
            </div>
            <button
              onClick={() => handleSort('name')}
              className="flex items-center gap-2 h-10 px-4 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              <span>Sort</span>
              {sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-md border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto h-[300px]">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <TableHeader
                    label="Name"
                    sortable
                    sortKey="name"
                    currentSort={sortBy}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <TableHeader label="Roles" />
                  <th className="px-4 py-3 text-left"></th>
                  <th className="px-4 py-3 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <MemberRow
                      key={member.id}
                      member={member}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      No members found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageMembers;
