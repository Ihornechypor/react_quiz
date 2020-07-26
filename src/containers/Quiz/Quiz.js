import React, {Component} from 'react';
import classes from './Quiz.module.css';
import ActiveQuiz from '../../components/ActiveQuiz/ActiveQuiz';
import FinishedQuiz from '../../components/FinishedQuiz/FinishedQuiz';
import axios from "../../axios/axios";
import Loader from "../../components/UI/loader/Loader";

 
class Quiz extends Component {

    state = {
        results: {}, 
        isFinished: false,
        activeQustion: 0,
        answerState: null,
        quiz: [],
        loading: true
    }

    onListAnswerClick = (listAnswersId) =>{
        if(this.state.answerState){
            const key = Object.keys(this.state.answerState)[0];
            if (this.state.answerState[key] === 'success') {
                return;
            }
        }

        const question = this.state.quiz[this.state.activeQustion]
        const results = this.state.results

        if(question.listAnswersRightId === listAnswersId){
            if(!results[question.id]){
                results[question.id] = 'success'
            }

            this.setState({
                answerState: {[listAnswersId]: 'success'},
                results
            })
            const timeout = window.setTimeout(()=>{
                if(this.isQuizFunished()){
                    this.setState({
                        isFinished: true
                    })

                } else {
                    this.setState({
                        activeQustion: this.state.activeQustion + 1,
                        answerState: null
                    })
                    
                }
                window.clearTimeout(timeout)
            }, 1000)

       
        } else {
            results[question.id] = 'error'
            this.setState({
                answerState: {[listAnswersId]: 'error'},
                results
            })
        }
    }

    isQuizFunished(){
        return this.state.activeQustion + 1 === this.state.quiz.length
    }

    retryHandler = () => {
        this.setState({
            activeQustion: 0,
            answerState: null,
            isFinished: false,
            results: {}
        })
    }

    async componentDidMount() {
        try{
            const response = await axios.get(`/quizes/${this.props.match.params.id}.json`);
            const quiz = response.data;

            console.log(quiz)

            this.setState({
                quiz,
                loading: false
            })

        } catch(e){
            console.log(e)

        }

    }

    render(){
        return(
            <div className={classes.Quiz}>
                <div className={classes.QuizWrapper}>
                    <h2>
                        Quiz
                    </h2>

                    {
                        this.state.loading
                        ? <Loader/>
                        : this.state.isFinished
                            ?  <FinishedQuiz
                                results={this.state.results}
                                quiz={this.state.quiz}
                                onRetry={this.retryHandler}
                            />
                            :  <ActiveQuiz
                                listAnswers={this.state.quiz[this.state.activeQustion].listAnswers}
                                listQuestion={this.state.quiz[this.state.activeQustion].listQuestion}
                                onListAnswerClick={this.onListAnswerClick}
                                listAnswersLen={this.state.quiz.length}
                                listAnswersNumber={this.state.activeQustion + 1}
                                ckickedAnswerState={this.state.answerState}
                            />
                    }

                </div>
            </div>
        )
    }
}

export default Quiz