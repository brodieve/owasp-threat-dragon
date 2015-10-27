'use strict'

describe('custom shape tests', function() {
	
	var graph;
	var diagram;
	var diagramElement;
	var isIE;
	var isFirefox;
	var translateSeperator;
	
	beforeEach(function() {
		
		setFixtures(sandbox({ id: 'diagramElement' }));
		diagramElement = $('#diagramElement');
		graph = new joint.dia.Graph();
		diagram = new joint.dia.Paper({
			el: $(diagramElement),
			width: 600,
			height: 400,
			gridSize: 10,
			model: graph
		});
		
		isIE = false;

		if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
			isIE = true;
		}
		
		isFirefox = false;
		
		if (navigator.userAgent.indexOf('Firefox') !== -1) {
			isFirefox = true;
		}
		 
		//IE represents translate tranform differently - uses a space to seperate co-ords instead of a comma
		translateSeperator = isIE? ' ' : ',';
		
	});
	
	it('should place a process element', function(){
		
		var label = 'new process';
		var x = 50;
		var y = 60;
		var cell = new joint.shapes.tm.Process({
			position: {x: x, y: y},
			attr: {text: {text: label}}
		});
		
		graph.addCell(cell);
		expect(diagramElement).toContainElement('g.element-tools');
		expect(diagramElement.find('g.element-tools')).toContainElement('g.element-tool-remove');
		expect(diagramElement.find('g.element-tools')).toContainElement('g.element-tool-link');
		expect(diagramElement).toContainElement('g.element.tm.Process');
		expect(diagramElement.find('g.element.tm.Process')).toHaveAttr('transform', 'translate(' + x + translateSeperator + y + ')');
		expect(diagramElement).toContainElement('circle.element-process');
		
	});
	
	it('should place an actor element', function(){
		
		var label = 'new actor';
		var x = 50;
		var y = 60;
		var cell = new joint.shapes.tm.Actor({
			position: {x: x, y: y},
			attr: {text: {text: label}}
		});
		
		graph.addCell(cell);
		expect(diagramElement).toContainElement('g.element-tools');
		expect(diagramElement.find('g.element-tools')).toContainElement('g.element-tool-remove');
		expect(diagramElement.find('g.element-tools')).toContainElement('g.element-tool-link');
		expect(diagramElement).toContainElement('g.element.tm.Actor');
		expect(diagramElement.find('g.element.tm.Actor')).toHaveAttr('transform', 'translate(' + x + translateSeperator + y + ')');
		expect(diagramElement).toContainElement('rect.element-actor');
		
	});
	
	it('should place a store element', function(){
		
		var label = 'new store';
		var x = 50;
		var y = 60;
		var cell = new joint.shapes.tm.Store({
			position: {x: x, y: y},
			attr: {text: {text: label}}
		});
		
		graph.addCell(cell);
		expect(diagramElement).toContainElement('g.element-tools');
		expect(diagramElement.find('g.element-tools')).toContainElement('g.element-tool-remove');
		expect(diagramElement.find('g.element-tools')).toContainElement('g.element-tool-link');
		expect(diagramElement).toContainElement('g.element.tm.Store');
		expect(diagramElement.find('g.element.tm.Store')).toHaveAttr('transform', 'translate(' + x + translateSeperator + y + ')');
		expect(diagramElement).toContainElement('path.element-store');
		
	});
	
	it('should place a boundary element', function(){
		
		var source = {x: 50, y: 60};
		var target = {x:100, y: 120};
		
		var cell = new joint.shapes.tm.Boundary({
			target: target,
			source: source
		});
		
		graph.addCell(cell);
		expect(diagramElement).toContainElement('g.tm.Boundary.link');
	});

	it('should set the boundary label', function(){
		
		var source = {x: 50, y: 60};
		var target = {x:100, y: 120};
		
		var cell = new joint.shapes.tm.Boundary({
			target: target,
			source: source
		});
		
		var label = 'boundary';	
		cell.setLabel(label);
		graph.addCell(cell);
		expect(diagramElement.find('g.label').find('tspan')[0]).toContainText(label);
	});
	
	it('should place a flow element', function(){
		
		var source = {x: 50, y: 60};
		var target = {x:100, y: 120};
		
		var cell = new joint.shapes.tm.Flow({
			target: target,
			source: source
		});
		
		graph.addCell(cell);
		expect(diagramElement).toContainElement('g.tm.Flow.link');
	});
	
	it('should set the flow label', function(){
		
		var source = {x: 50, y: 60};
		var target = {x:100, y: 120};
		
		var cell = new joint.shapes.tm.Flow({
			target: target,
			source: source
		});
		
		var label = 'flow';	
		cell.setLabel(label);
		graph.addCell(cell);
		expect(diagramElement.find('g.label').find('tspan')[0]).toContainText(label);
	});
	
	it('should place a flow elment with source and target', function() {
		
		var source = new joint.shapes.tm.Process({
			position: {x: 50, y: 50},
			attr: {text: {text: 'source'}}
		});
		
		var sourceId = source.cid;
		var target = new joint.shapes.tm.Process({
			position: {x: 150, y: 150},
			attr: {text: {text: 'target'}}
		});
		
		var targetId = target.cid;
		var flow = new joint.shapes.tm.Flow({
			target: target,
			source: source
		});
		
		graph.addCells([source, target, flow]);
		expect(flow.attributes.source.cid).toEqual(sourceId);
		expect(flow.attributes.target.cid).toEqual(targetId);
	});
	
	it('should highlight a cell', function() {
		
		var cell = new joint.shapes.tm.Process({
			position: {x: 50, y: 60},
			attr: {text: {text: 'process'}}
		});
		
		graph.addCell(cell);
		var cellView = diagram.findViewByModel(cell);
		//jasmine-jquery hasClass matcher does not work - is it because is SVG?
		expect($(diagramElement).find('g.element.tm.Process').attr('class')).toEqual('element tm Process');
		cellView.setSelected();
		expect($(diagramElement).find('g.element.tm.Process').attr('class')).toEqual('element tm Process highlighted');
	});
	
	it('should unhighlight a cell', function() {
		
		var cell = new joint.shapes.tm.Process({
			position: {x: 50, y: 60},
			attr: {text: {text: 'process'}}
		});
		
		graph.addCell(cell);
		var cellView = diagram.findViewByModel(cell);
		cellView.setSelected();
		//jasmine-jquery hasClass matcher does not work - is it because is SVG?
		expect($(diagramElement).find('g.element.tm.Process').attr('class')).toEqual('element tm Process highlighted');
		cellView.setUnselected();
		expect($(diagramElement).find('g.element.tm.Process').attr('class')).toEqual('element tm Process');

	});
	
	it('should highlight a link', function() {
		
		var cell = new joint.shapes.tm.Flow({
			target: {x: 50, y: 60},
			source: {x:100, y: 120}
		});
		
		graph.addCell(cell);
		var cellView = diagram.findViewByModel(cell);
		//jasmine-jquery hasClass matcher does not work - is it because is SVG?
		expect($(diagramElement).find('g.tm.Flow.link').attr('class')).toEqual('tm Flow link');
		cellView.setSelected();
		expect($(diagramElement).find('g.tm.Flow.link').attr('class')).toEqual('tm Flow link highlighted');
	});
	
	it('should unhighlight a link', function() {
		
		var cell = new joint.shapes.tm.Flow({
			target: {x: 50, y: 60},
			source: {x:100, y: 120}
		});
		
		graph.addCell(cell);
		var cellView = diagram.findViewByModel(cell);
		//jasmine-jquery hasClass matcher does not work - is it because is SVG?
		cellView.setSelected();
		expect($(diagramElement).find('g.tm.Flow.link').attr('class')).toEqual('tm Flow link highlighted');
		cellView.setUnselected();
		expect($(diagramElement).find('g.tm.Flow.link').attr('class')).toEqual('tm Flow link');
	});
	
	it('should remove an element', function() {
		
		var cell = new joint.shapes.tm.Process({
			position: {x: 50, y: 60},
			attr: {text: {text: 'process'}}
		});
		
		graph.addCell(cell);
		
		var removeTool = diagramElement.find('.element-tool-remove').children('circle');
		expect(graph.getElements().length).toEqual(1)
		
		//polyfill for firefox - avoids error in JointJS when clientX/Y is undefined
		if (isFirefox) {
			var event = new MouseEvent('click', {clientX: 0, clientY: 0, bubbles: true})
			removeTool[0].dispatchEvent(event);		
		} else {
			removeTool.click();				
		}
		
		expect(graph.getElements().length).toEqual(0)
	});
	
	it('should fire a linkFrom event', function() {
		
		var cell = new joint.shapes.tm.Process({
			position: {x: 50, y: 60},
			attr: {text: {text: 'process'}}
		});
		
		graph.addCell(cell);
		
		var handlers = {onClick: function() {}};	
		spyOn(handlers, 'onClick');
		diagram.on('cell:pointerclick', handlers.onClick);
		
		var removeTool = diagramElement.find('.element-tool-link').children('circle');
		expect(handlers.onClick).not.toHaveBeenCalled();
		
		//polyfill for firefox - avoids error in JointJS when clientX/Y is undefined
		if (isFirefox) {
			var event = new MouseEvent('click', {clientX: 0, clientY: 0, bubbles: true})
			removeTool[0].dispatchEvent(event);		
		} else {
			removeTool.click();				
		}
		
		expect(handlers.onClick).toHaveBeenCalled();
		expect(handlers.onClick.calls.argsFor(0)[0]._action).toEqual('linkFrom');
	});
	
	it('should fire a removeLinkFrom event', function() {
		
		var cell = new joint.shapes.tm.Process({
			position: {x: 50, y: 60},
			attr: {text: {text: 'process'}}
		});
		
		graph.addCell(cell);
		
		var handlers = {onClick: function() {}};	
		spyOn(handlers, 'onClick');
		diagram.on('cell:pointerclick', handlers.onClick);
		
		//jquery addClass does not work - maybe because it is SVG
		diagramElement.find('.element-tool-link').attr('class', 'element-tool-link linking');
		var removeTool = diagramElement.find('.element-tool-link').children('circle');
		expect(handlers.onClick).not.toHaveBeenCalled();
		
		//polyfill for firefox - avoids error in JointJS when clientX/Y is undefined
		if (isFirefox) {
			var event = new MouseEvent('click', {clientX: 0, clientY: 0, bubbles: true})
			removeTool[0].dispatchEvent(event);		
		} else {
			removeTool.click();				
		}
		
		expect(handlers.onClick).toHaveBeenCalled();
		expect(handlers.onClick.calls.argsFor(0)[0]._action).toEqual('removeLinkFrom');
	});
	
	it('should fire an event with no action', function() {
		
		var cell = new joint.shapes.tm.Process({
			position: {x: 50, y: 60},
			attr: {text: {text: 'process'}}
		});
		
		graph.addCell(cell);
		
		var handlers = {onClick: function() {}};	
		spyOn(handlers, 'onClick');
		diagram.on('cell:pointerclick', handlers.onClick);

		var nonToolElement = diagramElement.find('g.element.tm.Process');
		expect(handlers.onClick).not.toHaveBeenCalled();
		
		//polyfill for firefox - avoids error in JointJS when clientX/Y is undefined
		if (isFirefox) {
			var event = new MouseEvent('click', {clientX: 0, clientY: 0, bubbles: true})
			nonToolElement[0].dispatchEvent(event);		
		} else {
			nonToolElement.click();				
		}

		expect(handlers.onClick).toHaveBeenCalled();
		expect(handlers.onClick.calls.argsFor(0)[0]._action).toEqual('');
	});
});