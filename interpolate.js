function FindInterval(knots, time) {
    let span = 0;
	// najdi interval, v ktorom sa nachadza dany cas
	if (time >= (knots[knots.length - 1])) {
		span = knots.length - 1;
		return [false, span];
	}
	if (time <= knots[0]) {
		span = 0;
		return [false, span];
	}

	span = -1;
	while (time > knots[span + 1]) {
		span++;
	}

	// mame span interval, znormalizuj cas v ramci spanu
	if (knots[span] == knots[span + 1]) {
		return [false, span];
	}

	return [true, span];
}

// https://en.wikipedia.org/wiki/Cubic_Hermite_spline
function InterpolateVectorsCubic(knots, values, time, loop) {
	if (knots.length < 1 || knots.length != values.length) {
        return vec3.fromValues(0.0, 0.0, 0.0);
    }

    if (loop) {
        time = time%knots[knots.length-1];
    }

    [success, span] = FindInterval(knots, time);
	if (!success) return values[span];

	// pre koncove hodnoty span intervalu, vypocitaj dotykove vektory
	// pouzijeme kardinalny splajn s parametrom tension
	let tension = 0;
	let prev_value = values[span];
	let prev_time = knots[span];
	if (span > 0) {
		prev_value = values[span - 1];
		prev_time = knots[span - 1];
	}
	let next_value = values[span + 1];
	let next_time = knots[span + 1];
	if (span < values.lenth - 2) {
		next_value = values[span + 2];
		next_time = knots[span + 2];
	}
	let begin_tangent = vec3.fromValues(0.0, 0.0, 0.0);
	let end_tangent = vec3.fromValues(0.0, 0.0, 0.0);
	//vektory na konci budu nulove
	if (knots[span + 1] - prev_time != 0 && (span != 0)) {
        for (let i = 0; i < 3; i++) {
            begin_tangent[i] = (1.0 - tension) * (values[span + 1][i] - prev_value[i]) / (knots[span + 1] - prev_time);
        }
	}
	if (next_time - knots[span] != 0 && (span < values.length - 2)) {
        for (let i = 0; i < 3; i++) {
            end_tangent[i] = (1.0 - tension) * (next_value[i] - values[span][i]) / (next_time - knots[span]);
        }
	}

	// mame span interval, znormalizuj cas v ramci spanu
	let u = (time - knots[span]) / (knots[span + 1] - knots[span]);

	// vypocitaj interpolovanu hodnotu na zaklade hermitovych polynomov
    let result = vec3.fromValues(0.0, 0.0, 0.0);

    let C1 = (2*u*u*u - 3*u*u + 1);
    let C2 = (u*u*u - 2*u*u + u)*(knots[span + 1] - knots[span]);
    let C3 = (-2*u*u*u + 3*u*u);
    let C4 = (u*u*u - u*u)*(knots[span + 1] - knots[span]);

    for (let i = 0; i < 3; i++) {
        result[i] = C1*values[span][i] + C2*begin_tangent[i] + C3*values[span + 1][i] + C4*end_tangent[i];
    }

	return result;
}
