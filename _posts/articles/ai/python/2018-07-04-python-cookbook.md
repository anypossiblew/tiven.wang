---
layout: post
theme: UbuntuMono
title: "Python - Cookbook"
excerpt: "Cookbook for Python"
modified: 2018-07-04T11:51:25-04:00
categories: articles
tags: [Python, Cookbook]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/6301.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/mauritania-6301
comments: true
share: true
references:
  - id: 1
    title: "What exactly can you do with Python? Here are Python’s 3 main applications."
    url: https://medium.freecodecamp.org/what-can-you-do-with-python-the-3-main-applications-518db9a68a78
  - id: 2
    title: "NumPy Cheat Sheet"
    url: https://www.dataquest.io/blog/numpy-cheat-sheet/
---

* TOC
{:toc}

> 因为 python 3 语言变化比较大，和 python 基本不兼容，所以在说 python 都会指明是 3 还是 2 版本的

## Installation

### On Windows

https://www.python.org/downloads/release/python-366/


### Run in Docker
镜像 [`docker pull python`][docker/python]

```
$ docker run -it --rm python:3 bash
root@e7c9f83cdaa9:/# python3
Python 3.7.0 (default, Jul  4 2018, 02:21:01)
[GCC 6.3.0 20170516] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

[docker/python]:https://hub.docker.com/_/python/

## IDE

### VSCode

#### Debugging

## Third Party Packages

### IPython

[IPython][ipython]

http://ipython.readthedocs.io/en/stable/

### matplotlib

[Matplotlib][matplotlib] is a Python 2D plotting library which produces publication quality figures in a variety of hardcopy formats and interactive environments across platforms. Matplotlib can be used in Python scripts, the Python and IPython shells, the Jupyter notebook, web application servers, and four graphical user interface toolkits.

Install via `pip3`
```
pip3 install matplotlib
```

#### %matplotlib inline

Provided you are running IPython, the %matplotlib inline will make your plot outputs appear and be stored within the notebook.

`%matplotlib` is a magic function in IPython.

> IPython has a set of predefined ‘magic functions’ that you can call with a command line style syntax. There are two kinds of magics, line-oriented and cell-oriented. Line magics are prefixed with the % character and work much like OS command-line calls: they get as an argument the rest of the line, where arguments are passed without parentheses or quotes. Lines magics can return results and can be used in the right hand side of an assignment. Cell magics are prefixed with a double %%, and they are functions that get as an argument not only the rest of the line, but also the lines below it in a separate argument.

`%matplotlib inline` sets the backend of matplotlib to the 'inline' backend:

> To set this up, before any plotting or import of matplotlib is performed you must execute the %matplotlib magic command. This performs the necessary behind-the-scenes setup for IPython to work correctly hand in hand with matplotlib; it does not, however, actually execute any Python import commands, that is, no names are added to the namespace.
>
> A particularly interesting backend, provided by IPython, is the  inline backend. This is available only for the Jupyter Notebook and the Jupyter QtConsole. It can be invoked as follows:
>
> `%matplotlib inline` With this backend, the output of plotting commands is displayed inline within frontends like the Jupyter notebook, directly below the code cell that produced it. The resulting plots will then also be stored in the notebook document.






[matplotlib]:https://matplotlib.org
[ipython]:https://ipython.org/
