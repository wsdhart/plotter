/* © Copyright 2016 Sam Hart, All rights reserved */

"use strict";

window.onload = function init(){ updatePlot(); }

function update()
{
    var values = getValues();

    if(values.length == 0)
	return;

    var n = values.length;

    var returned = range(values);
    var min = returned[0];
    var max = returned[1];
    var mean = returned[2];

    var sd0 = sd(mean,values);

    var median0 = median(values);

    returned = iq(values);
    var q1 = returned[0];
    var q3 = returned[1];

    setValues(min,max,mean,sd0,median0,q1,q3,n);

    updatePlot(values,min,max);
}

function setValues(min,max,mean,sd,median,q1,q3,n)
{
    document.getElementById("min").innerHTML = min;
    document.getElementById("max").innerHTML = max;
    document.getElementById("mean").innerHTML = mean;
    document.getElementById("range").innerHTML = max - min || "";
    document.getElementById("sd").innerHTML = sd;
    document.getElementById("median").innerHTML = median;
    document.getElementById("q1").innerHTML = q1;
    document.getElementById("q3").innerHTML = q3;
    document.getElementById("iqr").innerHTML = q3 - q1 || "";
    document.getElementById("n").innerHTML = n;
}

function getValues()
{
    var table = document.getElementById("input");
    var values = [];
    for(var i = 0 ; i < table.rows.length ; i++)
    {
	table.rows[i].style.color = "#000000";
	var text = document.getElementById("input_data_" + i);
	var value = text.value;
	var parsed = parseFloat(value);
	if(!isNaN(parsed))
	{
	    values[i] = parsed;
	}
	else
	{
	    table.rows[i].style.color = "#ff0000";
	    return [];
	}
    }

    return values;
}

function range(some_array)
{
    var min = 0x40000000;
    var max = 0;
    var mean = 0;

    for(var i = 0 ; i < some_array.length ; i++)
    {
	var value = some_array[i];
	mean += value;

	if(value < min)
	    min = value;
	if(value > max)
	    max = value;
    }

    mean = mean / some_array.length;

    return [min , max , mean];
}

function variance(mean,some_array)
{
    var total = 0;

    for(var i = 0 ; i  < some_array.length ; i++)
    {
	var value = some_array[i];
	value -= mean;
	value *= value;
	total += value;
    }

    return total / some_array.length;
}

function sd(mean,some_array)
{
    return Math.sqrt(variance(mean,some_array));
}

function sorter(a,b){ return a - b; }

function median(some_array)
{
    var median;
    var h = Math.floor(some_array.length / 2);
    some_array.sort(sorter);
    
    if(some_array.length % 2 == 0)
	median = (some_array[h-1] + some_array[h]) / 2;
    else
	median = some_array[h];

    return median;
}

function iq(some_array)
{
    var q1, q3;
    var h = Math.floor(some_array.length / 2);
    some_array.sort(sorter);
    var first = some_array.slice(0,h);
    q1 = median(first);
    var second = some_array.slice(h);
    q3 = median(second);

    return [q1,q3];
}

function new_value()
{
    var table = document.getElementById("input");
    var row = table.insertRow(-1);
    var n = row.insertCell(0);
    n.innerHTML = table.rows.length;
    var value = row.insertCell(1);
    var input = document.createElement("INPUT");
    input.setAttribute("type","text");
    input.id = "input_data_" + (table.rows.length - 1);
    value.appendChild(input);
}

function clear_table()
{
    var table = document.getElementById("input");
    while(table.rows.length > 0)
	table.deleteRow(0);

    setValues("","","","","","","","");

    updatePlot();
}

