
//in here try having a separate class for the userParticle display like the calculator ex.
    //InputDisplay class, which should be rendered in the Input class


//the GenParticle component



class GenParticle extends React.Component{
    constructor(props){
        super(props)
        this.randomNum = React.createRef();
        this.detector_core = React.createRef();
        this.detector_events = React.createRef();
    }

    componentDidMount(){
        let particle = this.randomNum.current // reference to the randomNum element

        
        setTimeout(
            function(){
                particle.innerHTML = particle.innerHTML.replace(/\w|\W/gi, '&#183;');
            },
            1200);
            
    }


    componentDidUpdate(){
        let number, time;
        number = this.props.level.main
        time = 100*Math.min((number + 2), 5) + 400*Math.max((number - 5), 0);

        let particle = this.randomNum.current

        setTimeout(
            function(){
                particle.innerHTML = particle.innerHTML.replace(/\w|\W/gi, '&#183;');
            },
            time);
        }

    render(){
        return(
            <div id = "main_app">
                <div className="app_initoutput">
                    

                    <p id="randomNum" ref={this.randomNum}>
                        {(this.props.wrong < 5) ? atob(this.props.question) : '????'}
                    </p>
                    <div className = "detector" id="detector-holder">  
                        <canvas id="detector_core" width = {400} height = {400}/> 
                        <canvas id = "detector_events" width={400} height={400}/> 
                    </div>      
                </div>
            </div>
        )
    }
    
    }


class LevelWrong extends React.Component{
    render(){
        return(
            <div id = "main_app">
                <div className="app_initoutput">
                    <p className="app_level">
                        Level: {this.props.level.main} - {this.props.level.sub}
                    </p>
                    <p className="app_wrong">
                        Wrong: {this.props.wrong}/5
                    </p>
                </div>
            </div>
        )
    }
}



class ButtonInput extends React.Component{
    render(){
        return(
        <div className = "inputbuttons">
            <button name = "0" onClick = {e => this.props.onClick(e.target.name)}>0</button>
            <button name = "1" onClick = {e => this.props.onClick(e.target.name)}>1</button>
            <button name = "2" onClick = {e => this.props.onClick(e.target.name)}>2</button>
            <button name = "3" onClick = {e => this.props.onClick(e.target.name)}>3</button>
            <button name = "4" onClick = {e => this.props.onClick(e.target.name)}>4</button>
            <br/>
            <button name = "Clear" onClick = {e =>this.props.onClick(e.target.name)}>Clear</button>
            <button name = "Restart" onClick = {e => this.props.onClick(e.target.name)}>Restart</button>
            <button name = "Submit" onClick = {e => this.props.onClick(e.target.name)}>Submit</button>
        </div>
        );//might be worth putting in type="button"
    }
}


//Input section 
class Input extends React.Component{
    constructor(props){
        super(props);
        this.handleUserInput = this.handleUserInput.bind(this);
        this.userParticle = React.createRef();
        this.state = {
            userParticle: ""
        }
    }

    onClick = button => {
        if (button === "Submit"){
            this.handleUserInput()
        }

        else if (button === "Clear"){
            this.setState({
                userParticle: ""
            })
        }

        else if(button === "Restart"){
            this.handleReset()
        }

        else{
            this.setState({
                userParticle: this.state.userParticle + button
            })
        }
    }

    handleUserInput() {
        //e.preventDefault(); 
        let userParticle = btoa(this.state.userParticle);
        this.state.userParticle = "";
        this.props.compareUserInput(userParticle);

    }

    handleReset = () => {
        this.props.onReset();
        this.setState({
            userParticle: ""
        })
    }

    render(){
        let layout = ''
            //userParticle = this.state.userParticle;

        if(this.props.wrong < 5){
            layout = 
            <div id = "main_app">
                <div className="app_input">
                    <table>
                        <tr>
                            <div className = "userParticle">
                                <p ref ={this.userParticle}>Particles: {this.state.userParticle}</p>
                            </div>
                        </tr>
                        <tr>
                            <ButtonInput onClick = {this.onClick}/>                           
                        </tr>
                    </table>            
                </div>      
            </div>
        }
        //<InputDisplay ref={this.userParticle} userParticle={this.state.userParticle}/> was in the userParticle div
        else{
            layout = 
            <div className = "app_end">
                <p>Better luck next time!</p>
                <br/>
                <button name = "Restart" onClick = {this.handleReset}>Restart</button>
            </div>
        }

        return(layout);
        }
}



//the App component
class App extends React.Component{
    constructor(props){
        super(props);
        this.compareUserInput = this.compareUserInput.bind(this);
        this.randomGenerate = this.randomGenerate.bind(this);
        this.resetState = this.resetState.bind(this);
        this.state = {
            question: btoa(this.randomGenerate(1)),
            level:{
                main: 1,
                sub: 1
            },
            wrong: 0
        }
    };

    resetState(){
        this.setState({
            question: btoa(this.randomGenerate(1)),
            level:{
                main: 1,
                sub: 1
            },
            wrong: 0,
        });
    }

    randomGenerate(number){
        let max = Math.pow(5, number)-1,
            min = Math.pow(5, (number-1)),
            rand = Math.floor(Math.random()*(max-min+1))+min;

        return (rand.toString(5));
    }

    compareUserInput(userParticle){
        let currQuestion = this.state.question,
            mainLevel = this.state.level.main,
            subLevel = this.state.level.sub,
            wrong = this.state.wrong,
            number;
            //userParticle = btoa(userParticle);

        if(userParticle == currQuestion){
            if(subLevel < 5){
                ++subLevel;
            }
            else if(subLevel == 5){
                ++mainLevel;
                subLevel = 1;
            }
        }
        else{
            ++wrong;
        }
        number = mainLevel;

        this.setState({
            question: btoa(this.randomGenerate(number)),
            level: {
                main: mainLevel,
                sub: subLevel
            },
            wrong: wrong,
        });
    }

    render(){
        return(
            <div id = "main_app">
                <GenParticle
                question = {this.state.question}
                wrong = {this.state.wrong}
                level = {this.state.level}
                />
                <LevelWrong
                wrong = {this.state.wrong}
                level = {this.state.level}
                />
                <Input
                compareUserInput={this.compareUserInput}
                wrong = {this.state.wrong}
                onReset = {this.resetState}
                />
                
            </div>
        )
    }

}
/*
to go into the render function above
<Detector
question = {this.state.question}
level = this.state.level}??
/>
*/


ReactDOM.render(<App/>, document.getElementById('app'))