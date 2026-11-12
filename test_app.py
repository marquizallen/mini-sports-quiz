import pytest
from app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True

    with app.test_client() as client:
        yield client

def test_get_nba_questions(client):
    response = client.get('/get-nba-questions')

    # Check HTTP response
    assert response.status_code == 200

    # Convert response into JSON
    data = response.get_json()

    # Check response status
    assert data['status'] == 'Success'

    # Check that a question was returned
    assert 'nba_questions' in data

    question = data['nba_questions']

    # Check the question structure
    assert 'question' in question
    assert 'answer' in question
    assert 'choices' in question

    # Check that choices contain four options
    assert len(question['choices']) == 4

    # Check that the correct answer is among the choices
    assert question['answer'] in question['choices']

def test_get_nfl_questions(client):
    response = client.get('/get-nfl-questions')

    # Check HTTP response
    assert response.status_code == 200

    # Convert response into JSON
    data = response.get_json()

    # Check response status
    assert data['status'] == 'Success'

    # Check that a question was returned
    assert 'nfl_questions' in data

    question = data['nfl_questions']

    # Check the question structure
    assert 'question' in question
    assert 'answer' in question
    assert 'choices' in question

    # Check that choices contain four options
    assert len(question['choices']) == 4

    # Check that the correct answer is among the choices
    assert question['answer'] in question['choices']    

def test_get_boxing_questions(client):
    response = client.get('/get-boxing-questions')

    # Check HTTP response
    assert response.status_code == 200

    # Convert response into JSON
    data = response.get_json()

    # Check response status
    assert data['status'] == 'Success'

    # Check that a question was returned
    assert 'boxing_questions' in data

    question = data['boxing_questions']

    # Check the question structure
    assert 'question' in question
    assert 'answer' in question
    assert 'choices' in question

    # Check that choices contain four options
    assert len(question['choices']) == 4

    # Check that the correct answer is among the choices
    assert question['answer'] in question['choices']    