const express = require('express');

const getAllUsers = (req, res) => {
  res.status(500).json({
    sttaus: 'error',
    message: 'route unimplemented',
  });
};

const getSingleUser = (req, res) => {
  res.status(500).json({
    sttaus: 'error',
    message: 'route unimplemented',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    sttaus: 'error',
    message: 'route unimplemented',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    sttaus: 'error',
    message: 'route unimplemented',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    sttaus: 'error',
    message: 'route unimplemented',
  });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  updateUser,
  createUser,
  deleteUser,
};
