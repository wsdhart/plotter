/* © Copyright 2016 Sam Hart, All rights reserved */

"use strict";

var plot_type = 0;
var TWO_PI = 2 * Math.PI;

function updatePlot(some_array,min,max)
{
    var canvas = document.getElementById("plotting_canvas");
    if(canvas.getContext)
    {
	var context = canvas.getContext('2d');

	var width = canvas.width;
	var height = canvas.height;

	clear_plot(context,width,height);

	default_plot(context,min,max,width,height);

	if(some_array && some_array.length > 0)
	{
	    context.fillStyle = "#000000";
	    switch(plot_type)
	    {
		case 0 :
		dot_plot(context,min,max,width,height,some_array);
		break;
		case 1 : // Boxplot
		case 2 : // Histogram
		case 3 : // Scatterplot
		default :
		break;
	    }
	}
	else
	{
	    context.fillStyle ="#000000";
	    context.fillText("PLOTTER",(width-4*12) >>> 1,height >>> 1);
	}
    }
}

function map(value,nMin,nMax,lMin,lMax)
{
    return lMin + (lMax - lMin) * ((value - nMin) / (nMax - nMin));
}

function select_plotting(type)
{
    switch(type)
    {
	case 0 : // Dotplot
	plot_type = 0;
	console.log("Dotplotting ...");
	break;
	case 1 : // Boxplot
	plot_type = 1;
	console.log("Boxplotting ...");
	break;
	case 2 : // Histogram
	plot_type = 2;
	console.log("Histogramming ...");
	break;
	case 3 : // Scatterplot
	plot_type = 3;
	console.log("Scatterplotting ...");
	break;
	default :
	console.log("Defaulting ...");
	break;
    }
}

function clear_plot(context,width,height)
{
    context.fillStyle = "#ffffff";
    context.fillRect(0,0,width,height);
}

function default_plot(context,min,max,width,height)
{
    context.beginPath();
    context.moveTo(1,1);
    context.lineTo(1,height-1);
    context.lineTo(width-1,height-1);
    context.lineTo(width-1,1);
    context.lineTo(1,1);
    context.closePath();
    context.lineWidth = 3;
    context.strokeStyle = "#000000";
    context.stroke();
}

function dot_plot(context,min,max,width,height,some_array)
{
    var range = max - min;
    var divs = range / 7 ;
    divs = clip_values(divs);

    context.beginPath();
    for(var i = min ; i <= max ; i += divs)
    {
	var point = map(i,min,max,20,width-20);
	context.moveTo(point,20);
	context.lineTo(point,height-20);
	context.fillText(i,point-3,height-10);
    }
    context.lineWidth = 2;
    context.strokeStyle = "#dddddd";
    context.stroke();

    context.lineWidth = 1;
    context.strokeStyle = "#000000";
    for(var i = 0; i < some_array.length ; i++)
    {
	var value = some_array[i];
	var point = map(value,min,max,20,width-20);
	context.beginPath();
	context.arc(point,height >>> 1,2.5,0,TWO_PI,true);
	context.stroke();
    }
}

function clip_values(value)
{
    var scale = Math.floor(Math.log(value)/Math.LN10);
    value /= Math.pow(10,scale);
    value = Math.round(value);
    value *= Math.pow(10,scale);

    return value;
}
