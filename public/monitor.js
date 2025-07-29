const colors = [{color: "0099FF", float: 0.2}, {color: "FFF700", float: 0.7}, {color: "FF0000", float: 1.0}];

class Gradient{
    colormatrix;

    constructor(colors){
        this.colormatrix = colors.map(({color, float}) => ({color: color.match(/.{1,2}/g), float: float}));
    }

    getColor(percentage) {
        const shortpercentage = parseFloat(percentage.toFixed(2));
        if(this.colormatrix[0].float > shortpercentage) return "#"+this.colormatrix[0].color.join("");
        if(this.colormatrix[this.colormatrix.length-1].float < shortpercentage) return "#"+this.colormatrix[this.colormatrix.length-1].color.join("");
        
        let temp = this.colormatrix.map(({float}) => float);

        if(temp.includes(shortpercentage)) return "#"+this.colormatrix[temp.indexOf(shortpercentage)].color.join("");

        temp = temp.map(n => parseFloat((n-shortpercentage).toFixed(2)));
        
        const lower = this.colormatrix[temp.indexOf(Math.max(...temp.filter(n => n < 0)))];
        const higher = this.colormatrix[temp.indexOf(Math.min(...temp.filter(n => n > 0)))];

        const mixperc = parseFloat(((shortpercentage-lower.float)/(higher.float-lower.float)).toFixed(2));

        const mixin = [Math.round(Math.abs(parseInt(lower.color[0], 16)-parseInt(higher.color[0], 16))*mixperc), Math.round(Math.abs(parseInt(lower.color[1], 16)-parseInt(higher.color[1], 16))*mixperc), Math.round(Math.abs(parseInt(lower.color[2], 16)-parseInt(higher.color[2], 16))*mixperc)]

        return "#"+[(parseInt(lower.color[0], 16) > higher.color[0] ? parseInt(lower.color[0], 16) - mixin[0] : parseInt(lower.color[0], 16) + mixin[0]).toString(16), (parseInt(lower.color[1], 16) > higher.color[1] ? parseInt(lower.color[1], 16) - mixin[1] : parseInt(lower.color[1], 16) + mixin[1]).toString(16), (parseInt(lower.color[2], 16) > higher.color[2] ? parseInt(lower.color[2], 16) - mixin[2] : parseInt(lower.color[2], 16) + mixin[2]).toString(16)].map(n => n.length < 2 ? "0"+n : n).join("")
    }
}

if(window.location.search.includes("kraken")){
    const main = document.querySelector("#main");
    const textdat = document.querySelector("#dat");
    const svg = document.querySelector("#bc");

    window.nzxt = {
        v1: {
                onMonitoringDataUpdate: (data) => {
                const { cpus, gpus, ram, kraken } = data;
                const cumulativeLoad = Math.round((ram.inUse/ram.totalSize)*3333+gpus[0].load*3333+cpus[0].load*3333)
                textdat.innerHTML = cumulativeLoad;

                const grad = new Gradient(colors)
                svg.style="fill: "+grad.getColor(cumulativeLoad/9999)+";"
                textdat.style="color: "+grad.getColor(cumulativeLoad/9999)+";"
            }
        }
    };
}else {
    window.resizeTo(340,360)
    document.body.style = "overflow: hidden";
}

