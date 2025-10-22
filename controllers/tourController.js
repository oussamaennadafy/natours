const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const checkTourBody = (req, res, next) => {
  console.log(req.body);
  if (!req.body.tour)
    return res.status(400).json({
      status: 'fail',
      message: 'tour is required',
    });
  next();
};

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getSingleTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((el) => el.id === Number(id));
  if (!tour) {
    res.status(404).json({
      status: 'fail',
      message: 'item not found',
    });
    return;
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};

const createTour = async (req, res) => {
  const newid = tours[tours.length - 1].id + 1;
  const newTour = {
    id: newid,
    ...req.body,
  };
  await fs.promises.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify([...tours, newTour])
  );
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
};

const updateTour = async (req, res) => {
  const { id } = req.params;
  const { tour } = req.body;
  if (!tour) {
    res.status(400).json({
      status: 'fail',
      message: 'please input the tour data',
    });
    return;
  }
  const updatedTours = tours.map((CurrentTour) => {
    if (CurrentTour.id === Number(id)) {
      return {
        ...CurrentTour,
        ...tour,
      };
    }
    return CurrentTour;
  });
  await fs.promises.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(updatedTours)
  );
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const deleteTour = async (req, res) => {
  const { id } = req.params;
  const updatedTours = tours.filter((el) => el.id !== Number(id));
  await fs.promises.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(updatedTours)
  );
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

module.exports = {
  getAllTours,
  getSingleTour,
  createTour,
  updateTour,
  deleteTour,
  checkTourBody,
};
