from flask import Flask, render_template, request, jsonify, session
import random

app = Flask(__name__)
app.secret_key = 'your-secret-key'

@app.route("/")
def home():
    user_name = "Home"
    return render_template(
        "index.html", 
        name = user_name)

@app.route("/hello")
def helloPage():
    text = "Hello World!"
    return render_template(
        "hello.html", 
        msg = text)    

#User Input Name: 
@app.route('/process-text', methods=['POST'])
def processText():
    data = request.get_json()
    userText = data.get('text_input')
    processedText = userText

    session['nameOfUser'] = processedText
    return jsonify({
        'status':'Success',
        'result': processedText
    })


#CATEGORIES APP ROUTEs
@app.route('/categorySelection')
def userCategory():
    nbaCategory = 'NBA'
    nflCategory = 'NFL'
    boxingCategory = 'Boxing'

    return render_template(
        "html-containers/categories.html",
        name = session.get('nameOfUser'),
        nba = nbaCategory,
        nfl = nflCategory,
        boxing = boxingCategory)


@app.route('/submit-item', methods=['POST'])
def submitItem():
    data = request.get_json()
    question = data.get('question')
    userSelection = data.get('user_choice')


    print(userSelection)
    print(question)


    return jsonify ({
        'status': 'Submitted',
        'answer': 'userSelection'
    })

correctAnswers = []
@app.route('/to-correct-ans', methods=['POST'])
def submitToCorrect():
    
    data = request.get_json()
    question = data.get('question')
    userSelection = data.get('user_choice')
    correctAnswer = data.get('correctAnswer')

    answers =  {
        'userAnswer': userSelection,
        'question' : question,
        'correctanswer' : correctAnswer 
    }

    correctAnswers.append(answers)

    session['user_choice'] = userSelection 
    session['question'] = question
    session['correctAnswer'] = correctAnswer

    print(userSelection)
    print(question)
    print(correctAnswer)
    
    print (correctAnswers) 

    return jsonify ({
        'status': 'Submitted',
        'userAnswer': userSelection,
        'question': question,
        'correctAnswer': correctAnswer
    })

@app.route('/get-correct-ans', methods = ['GET'])
def getCorrectAns():
    return jsonify({
        'status': 'Success',
        'correctAnswers' : correctAnswers
    })

wrongAnswers = []
@app.route('/to-wrong-ans', methods=['POST'])
def submitToWrong():

    data = request.get_json()

    question = data.get('question')
    userSelection = data.get('user_choice')
    correctAnswer = data.get('correctAnswer')

    answers = {
        'userAnswer': userSelection,
        'question': question,
        'correctanswer': correctAnswer
    }

    wrongAnswers.append(answers)

    print(wrongAnswers)

    return jsonify({
        'success': True,
        'wrongAnswers': wrongAnswers
    })

@app.route('/get-wrong-ans', methods = ['GET'])
def getWrongAns():
    return jsonify({
        'status': 'Success',
        'wrongAnswers' : wrongAnswers
})


@app.route('/wrong-answers')
def render_wrong_ans():
    return render_template(
        "html-containers/sports-categories.html",
        wrongAnswers = wrongAnswers
        )

@app.route('/restart_quiz', methods=['POST'])
def restartQuiz():
    correctAnswers.clear()
    wrongAnswers.clear()

    return '', 204

@app.route('/get-nba-questions')
def get_nba_questions():
    question1 = {
        "question": "He is the only player who played in NBA Finals 6 times and have never lost, and is widely considered as the greatest basketball player of all time.",
        "answer": "Michael Jordan",
        "choices": ["Michael Jordan", "Kevin Durant", "Lebron James", "Larry Bird"]
    }
    question2 = {
        "question": "Which NBA player is known as the King and has won multiple NBA championships?",
        "answer": "LeBron James",
        "choices": ["Kevin Durant", "LeBron James", "Julius Erving", "Bill Russell"]
        
    }
    question3 = {
        "question": "Which NBA team has won the most championships in league history?",
        "answer": "Boston Celtics",
        "choices": ["Boston Celtics", "Los Angeles Lakers", "Chicacgo Bulls", "San Antonio Spurs"]
    }
    question4 = {
        "question": "Who holds the NBA record for the most career three-point shots made?",
        "answer": "Stephen Curry",
        "choices": ["Ray Allen", "Reggie Miller", "Stephen Curry", "Nikola Jokic"]
    }
    question5 = {
        "question": "Which basketball player was nicknamed The Black Mamba?",
        "answer": "Kobe Bryant",
        "choices": ["Dwyane Wade", "Kobe Bryant", "Paul Pierce", "Dirk Nowitzki"]
    }
    question6 = {
        "question": "Which NBA player scored 100 points in a single game, setting the league's all-time single-game scoring record?",
        "answer": "Wilt Chamberlain",
        "choices": ["Kareem Abdul-Jabbar", "Wilt Chamberlain", "Michael Jordan", "Kobe Bryant"]
    }

    question7 = {
        "question": "Which basketball player is famously known as 'The Answer'?",
        "answer": "Allen Iverson",
        "choices": ["Allen Iverson", "Chris Paul", "Steve Nash", "Dwyane Wade"]
    }

    question8 = {
        "question": "Which NBA team won a record 72 regular-season games during the 1995–1996 season?",
        "answer": "Chicago Bulls",
        "choices": ["Los Angeles Lakers", "Boston Celtics", "Chicago Bulls", "Houston Rockets"]
    }

    question9 = {
        "question": "Who was the first player in NBA history to win the MVP award unanimously?",
        "answer": "Stephen Curry",
        "choices": ["LeBron James", "Kobe Bryant", "Kevin Durant", "Stephen Curry"]
    }

    question10 = {
        "question": "Which NBA legend is known for winning 11 NBA championships as a player?",
        "answer": "Bill Russell",
        "choices": ["Magic Johnson", "Bill Russell", "Kareem Abdul-Jabbar", "Tim Duncan"]
    }

    questions = [
        question1, question2, question3, question4, question5,
        question6, question7, question8, question9, question10]

    random.shuffle(questions)
    return jsonify({
        'status': 'Success',
        'nba_questions': questions[1]
    })

@app.route('/get-nfl-questions')
def get_nfl_questions():
    question1 = {
        "question": "Which NFL team has won the most Super Bowl championships in history?",
        "answer": "Pittsburgh Steelers",
        "choices": ["Dallas Cowboys", "New England Patriots", "Pittsburgh Steelers", "San Francisco 49ers"]
    }

    question2 = {
        "question": "Who is widely known as the greatest quarterback of all time and has won seven Super Bowl championships?",
        "answer": "Tom Brady",
        "choices": ["Peyton Manning", "Tom Brady", "Joe Montana", "Patrick Mahomes"]
    }

    question3 = {
        "question": "Which NFL player is known by the nickname 'The GOAT' and played most of his career with the New England Patriots?",
        "answer": "Tom Brady",
        "choices": ["Aaron Rodgers", "Tom Brady", "Drew Brees", "Brett Favre"]
    }

    question4 = {
        "question": "Which NFL team is famously known as 'America's Team'?",
        "answer": "Dallas Cowboys",
        "choices": ["Green Bay Packers", "Dallas Cowboys", "New York Giants", "Chicago Bears"]
    }

    question5 = {
        "question": "Who holds the NFL record for the most career passing touchdowns?",
        "answer": "Tom Brady",
        "choices": ["Peyton Manning", "Drew Brees", "Tom Brady", "Aaron Rodgers"]
    }

    question6 = {
        "question": "Which NFL player is nicknamed 'Megatron' and is considered one of the greatest wide receivers in history?",
        "answer": "Calvin Johnson",
        "choices": ["Randy Moss", "Terrell Owens", "Calvin Johnson", "Jerry Rice"]
    }

    question7 = {
        "question": "Which NFL team completed a perfect 17-0 season, including the Super Bowl, in 1972?",
        "answer": "Miami Dolphins",
        "choices": ["Miami Dolphins", "New England Patriots", "San Francisco 49ers", "Pittsburgh Steelers"]
    }

    question8 = {
        "question": "Who holds the NFL record for the most career rushing yards?",
        "answer": "Emmitt Smith",
        "choices": ["Walter Payton", "Barry Sanders", "Adrian Peterson", "Emmitt Smith"]
    }

    question9 = {
        "question": "Which NFL player is famously known as 'The Sheriff' and won two Super Bowl championships?",
        "answer": "Peyton Manning",
        "choices": ["Tom Brady", "Peyton Manning", "John Elway", "Brett Favre"]
    }

    question10 = {
        "question": "Which NFL team is known for its iconic 'Cheesehead' fan tradition?",
        "answer": "Green Bay Packers",
        "choices": ["Chicago Bears", "Minnesota Vikings", "Green Bay Packers", "Detroit Lions"]
    }

    questions = [
        question1, question2, question3,
        question4, question5, question6,
        question7, question8, question9,
        question10
    ]
    random.shuffle(questions)
    return jsonify({
        'status': 'Success',
        'nfl_questions': questions[1]
    })

@app.route('/get-boxing-questions')
def get_boxing_questions():
    question1 = {
        "question": "Who is widely known as 'The Greatest' and is considered one of the greatest boxers of all time?",
        "answer": "Muhammad Ali",
        "choices": ["Mike Tyson", "Muhammad Ali", "Floyd Mayweather", "George Foreman"]
    }

    question2 = {
        "question": "Which boxer is famously known as 'Iron Mike'?",
        "answer": "Mike Tyson",
        "choices": ["Evander Holyfield", "Lennox Lewis", "Mike Tyson", "Roy Jones Jr."]
    }

    question3 = {
        "question": "Who holds the record for retiring from professional boxing with an undefeated record of 50-0?",
        "answer": "Floyd Mayweather Jr.",
        "choices": ["Manny Pacquiao", "Oscar De La Hoya", "Floyd Mayweather Jr.", "Canelo Alvarez"]
    }

    question4 = {
        "question": "Which Filipino boxing legend is the only boxer to win world titles in eight different weight divisions?",
        "answer": "Manny Pacquiao",
        "choices": ["Nonito Donaire", "Manny Pacquiao", "Juan Manuel Marquez", "Roberto Duran"]
    }

    question5 = {
        "question": "Who was the youngest heavyweight boxing champion in history, winning the title at just 20 years old?",
        "answer": "Mike Tyson",
        "choices": ["Muhammad Ali", "George Foreman", "Mike Tyson", "Lennox Lewis"]
    }

    question6 = {
        "question": "Which boxer was nicknamed 'Sugar Ray' and won Olympic gold at the 1976 Montreal Olympics?",
        "answer": "Sugar Ray Leonard",
        "choices": ["Sugar Ray Robinson", "Sugar Ray Leonard", "Marvin Hagler", "Thomas Hearns"]
    }

    question7 = {
        "question": "Who defeated Muhammad Ali in the famous 'Rumble in the Jungle' fight in 1974?",
        "answer": "George Foreman",
        "choices": ["Joe Frazier", "George Foreman", "Larry Holmes", "Ken Norton"]
    }

    question8 = {
        "question": "Which boxer is known as 'The Golden Boy'?",
        "answer": "Oscar De La Hoya",
        "choices": ["Canelo Alvarez", "Oscar De La Hoya", "Floyd Mayweather Jr.", "Julio Cesar Chavez"]
    }

    question9 = {
        "question": "Who was the first boxer in history to become an undisputed champion in three different weight divisions?",
        "answer": "Terence Crawford",
        "choices": ["Saul 'Canelo' Alvarez", "Manny Pacquiao", "Terence Crawford", "Oleksandr Usyk"]
    }

    question10 = {
        "question": "Which heavyweight boxer was nicknamed 'The Real Deal'?",
        "answer": "Evander Holyfield",
        "choices": ["Mike Tyson", "Evander Holyfield", "Riddick Bowe", "George Foreman"]
    }

    questions = [
        question1, question2, question3, question4, question5,
        question6, question7, question8, question9, question10
    ]

    random.shuffle(questions)
    return jsonify({
        'status': 'Success',
        'boxing_questions': questions[1]
    })
    

if __name__ == "__main__":
    app.run(debug=True)
