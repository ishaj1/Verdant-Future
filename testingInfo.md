# Testing

## Location of Test Files

- Frontend test files are located in `frontend/src/tests`.
- Backend test files are located in `backend/tests`.

## Tech Stack Used for Testing

- Frontend testing uses Jest for React.
- Backend testing uses Python testing frameworks pytest and unittest.

## Setup Instructions

### Frontend:

- Navigate to the frontend folder
- Run `npm test` to run all test files.
- Run `npm test -- -u` to run the tests with the additional step of updating any snapshots as needed.
- To run specific files, use `npm test frontend/src/tests/` followed by the directory path to the test files.

If any of the above commands don't work, you may need to install dependencies for Jest. [Here's a guide](https://zaferayan.medium.com/how-to-setup-jest-and-react-testing-library-in-vite-project-2600f2d04bdd) on setting up Jest and React Testing Library in a Vite project.

### Backend:

- Make sure to set up the database beforehand.
- Install the pytest library using `pip install pytest` if not done so.
- Navigate to the folder containing the tests and run `pytest test_to_run.py`.
