"use client";

import React, { useState, useEffect } from 'react';
import { MoreVertical, UserPlus, User, Shield, Bell, Search, ArrowDown, ArrowUp } from "lucide-react";

const members = [
  {
    id: '1',
    name: 'Chatverse bot',
    tag: 'Chatverse bot#4313',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    memberSince: '12 days ago',
    joinedDiscord: '12 days ago',
    joinMethod: 'Unknown',
    roles: ['Admin'],
    roleCount: 1,
    signals: true,
    messages: false
  },
  {
    id: '2',
    name: 'BlueWillow',
    tag: 'BlueWillow#6557',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    memberSince: '1 year ago',
    joinedDiscord: '2 years ago',
    joinMethod: 'Unknown',
    roles: ['BlueWillow'],
    roleCount: 1,
    signals: true,
    messages: false
  },
  {
    id: '3',
    name: 'SoundCloud',
    tag: 'SoundCloud#3508',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    memberSince: '1 year ago',
    joinedDiscord: '3 years ago',
    joinMethod: 'Unknown',
    roles: ['SoundCloud'],
    roleCount: 1,
    signals: true,
    messages: false
  },
  {
    id: '4',
    name: 'ServerStats',
    tag: 'ServerStats#0197',
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
    memberSince: '1 year ago',
    joinedDiscord: '6 years ago',
    joinMethod: 'Unknown',
    roles: ['ServerStats'],
    roleCount: 1,
    signals: true,
    messages: false
  },
  {
    id: '5',
    name: 'Birthday Bot',
    tag: 'Birthday Bot#5876',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    memberSince: '1 year ago',
    joinedDiscord: '5 years ago',
    joinMethod: 'Unknown',
    roles: ['Birthday Bot'],
    roleCount: 1,
    signals: true,
    messages: false
  },
  {
    id: '6',
    name: 'gunjanpatel',
    tag: 'gunjanpatel',
    avatarUrl: 'https://i.pravatar.cc/150?img=6',
    memberSince: '1 year ago',
    joinedDiscord: '4 years ago',
    joinMethod: 'Sever Discovery',
    roles: ['Admin', 'Developer'],
    roleCount: 2,
    signals: true,
    messages: true
  }
];

const MemberRow = ({ member, isSelected, onSelect }) => {
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
      <td className="py-4 pl-4">
        <input
          type="checkbox"
          id={`select-${member.id}`}
          checked={isSelected}
          onChange={(e) => onSelect(member.id, e.target.checked)}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
        />
      </td>
      <td className="py-4 pl-2">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 rounded-full ring-2 ring-white/10">
            {member.avatarUrl ? (
              <img
                src={member.avatarUrl}
                alt={member.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="h-full w-full rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-sm">
                {getInitials(member.name)}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm text-gray-900">{member.name}</span>
            <span className="text-xs text-gray-500">{member.tag}</span>
          </div>
        </div>
      </td>
      <td className="py-4 text-sm text-gray-600">{member.memberSince}</td>
      <td className="py-4 text-sm text-gray-600">{member.joinedDiscord}</td>
      <td className="py-4 text-sm text-gray-600">{member.joinMethod}</td>
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
          <Bell
            className={`h-4 w-4 ${member.signals ? 'text-green-500' : 'text-gray-400'
              }`}
          />
          <User
            className={`h-4 w-4 ${member.messages ? 'text-indigo-500' : 'text-gray-400'
              }`}
          />
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
                <span>Add Role</span>
              </button>
              <button
                onClick={handleKickMember}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left"
              >
                <span>Kick Member</span>
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

const TableHeader = ({ label, sortable, sortKey, currentSort, sortDirection, onSort }) => {
  const handleClick = () => {
    if (sortable && sortKey && onSort) {
      onSort(sortKey);
    }
  };

  return (
    <th className="px-4 py-3 text-left">
      <div
        className={`flex items-center gap-1 ${sortable ? 'cursor-pointer hover:text-gray-900' : ''
          }`}
        onClick={handleClick}
      >
        <span className="text-sm text-gray-600">{label}</span>
        {sortable && sortKey === currentSort && (
          sortDirection === 'asc' ? (
            <ArrowUp className="h-4 w-4 text-gray-600" />
          ) : (
            <ArrowDown className="h-4 w-4 text-gray-600" />
          )
        )}
      </div>
    </th>
  );
};

const ManageMembers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState(members);
  const [selectAll, setSelectAll] = useState(false);
  const [sortBy, setSortBy] = useState('memberSince');
  const [sortDirection, setSortDirection] = useState('desc');

  const parseTimeAgo = (timeAgo) => {
    const [value, unit] = timeAgo.split(' ');
    const numValue = parseInt(value);
    if (unit.includes('day')) return numValue;
    if (unit.includes('month')) return numValue * 30;
    if (unit.includes('year')) return numValue * 365;
    return 0;
  };

  useEffect(() => {
    const filtered = members.filter(member =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMembers(sortMembers(filtered, sortBy, sortDirection));
  }, [searchQuery, sortBy, sortDirection]);

  const sortMembers = (members, key, direction) => {
    return [...members].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      if (key === 'memberSince' || key === 'joinedDiscord') {
        aValue = parseTimeAgo(aValue);
        bValue = parseTimeAgo(bValue);
      }

      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const handleSort = (key) => {
    const newDirection = sortBy === key && sortDirection === 'desc' ? 'asc' : 'desc';
    setSortBy(key);
    setSortDirection(newDirection);
    setFilteredMembers(sortMembers(filteredMembers, key, newDirection));
  };

  const handleSelectMember = (id, isSelected) => {
    if (isSelected) {
      setSelectedMembers(prev => [...prev, id]);
    } else {
      setSelectedMembers(prev => prev.filter(memberId => memberId !== id));
    }
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedMembers(filteredMembers.map(member => member.id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handlePrune = () => {
    if (selectedMembers.length === 0) {
      alert("No members selected. Please select members to prune.");
      return;
    }

    alert(`${selectedMembers.length} members pruned. Selected members have been removed from the server.`);

    setFilteredMembers(prev => prev.filter(member => !selectedMembers.includes(member.id)));
    setSelectedMembers([]);
    setSelectAll(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Recent Members
          </h1>
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
              className="flex items-center gap-2 h-10 px-4 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              <span>Sort</span>
              {sortDirection === 'asc' ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
            </button>
            <button
              className="h-10 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={handlePrune}
            >
              Prune
            </button>
          </div>
        </div>

        <div className="bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </th>
                  <TableHeader
                    label="Name"
                    sortable
                    sortKey="name"
                    currentSort={sortBy}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <TableHeader
                    label="Member Since"
                    sortable
                    sortKey="memberSince"
                    currentSort={sortBy}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <TableHeader
                    label="Joined Discord"
                    sortable
                    sortKey="joinedDiscord"
                    currentSort={sortBy}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <TableHeader label="Join Method" />
                  <TableHeader label="Roles" />
                  <TableHeader label="Signals" />
                  <th className="px-4 py-3 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <MemberRow
                      key={member.id}
                      member={member}
                      isSelected={selectedMembers.includes(member.id)}
                      onSelect={handleSelectMember}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
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