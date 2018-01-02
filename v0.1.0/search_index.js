var documenterSearchIndex = {"docs": [

{
    "location": "index.html#",
    "page": "Home",
    "title": "Home",
    "category": "page",
    "text": ""
},

{
    "location": "index.html#CUTEst.jl-documentation-1",
    "page": "Home",
    "title": "CUTEst.jl documentation",
    "category": "section",
    "text": "This package provides an interface to CUTEst, the Constrained and Unconstrained Test Environment with safe threads for nonlinear optimization.This package uses NLPModels.jl, but it also gives direct access to the CUTEst functions."
},

{
    "location": "index.html#CUTEst-brief-history-1",
    "page": "Home",
    "title": "CUTEst brief history",
    "category": "section",
    "text": "CUTEst has been around for a while. It started as CUTE, then CUTEr, then CUTEr2, and finally CUTEst. The original project can be used independently of Julia.CUTEst works by decoding a .SIF file into other files and objects so that a user compiles links that to his code. It also gives the option of doing that for you, in which case you have to send some code to it's folder, and ask for the compilation.CUTEst gives you about 100 methods to access the objective and constraints functions, as well as their derivatives in many different formats. It also gives access to the problem's information, like number of variables, constraints, the initial point, the bounds, an so on."
},

{
    "location": "index.html#Installing-1",
    "page": "Home",
    "title": "Installing",
    "category": "section",
    "text": "On Linux, you'll need to install wget and gfortran, and possibly have to fix the location of libgfortran.so.On Ubuntu 14.04, you can do this withsudo apt-get install wget gfortran\nsudo ln -s /usr/lib/gcc/x86_64-linux-gnu/$(gfortran -dumpversion | cut -f1,2 -d.)/libgfortran.so /usr/local/libOn Ubuntu 16.04,sudo apt-get install wget gfortran\nsudo ln -s /usr/lib/x86_64-linux-gnu/libgfortran.so.3 /usr/local/lib/libgfortran.soOn Archlinux, dosudo pacman -S wget gfortranThe following commands should automatically download and install CUTEst and its dependencies.Pkg.add(\"CUTEst\")"
},

{
    "location": "index.html#Usage-1",
    "page": "Home",
    "title": "Usage",
    "category": "section",
    "text": "Check the tutorial for complete usage.The simplest use of CUTEst is through the interface of NLPModels.jl. Here's the quick reference guide.using CUTEst\n\nnlp = CUTEstModel(\"ROSENBR\")\nprintln(\"x0 = $(nlp.meta.x0)\")\nprintln(\"fx = $( obj(nlp, nlp.meta.x0) )\")\nprintln(\"gx = $( grad(nlp, nlp.meta.x0) )\")\nprintln(\"Hx = $( hess(nlp, nlp.meta.x0) )\")\nfinalize(nlp)Check the NLPModels API for details."
},

{
    "location": "index.html#Working-with-CUTEst-directly-1",
    "page": "Home",
    "title": "Working with CUTEst directly",
    "category": "section",
    "text": "We also have implemented function to allow access to the CUTEst functions directly. There is a specialized API which provides a Julian way to access them, and a core API which is only a wrapper for CUTEst. For more information see the section core, or the documentation here."
},

{
    "location": "index.html#Contents-1",
    "page": "Home",
    "title": "Contents",
    "category": "section",
    "text": ""
},

{
    "location": "tutorial.html#",
    "page": "Tutorial",
    "title": "Tutorial",
    "category": "page",
    "text": ""
},

{
    "location": "tutorial.html#Tutorial-1",
    "page": "Tutorial",
    "title": "Tutorial",
    "category": "section",
    "text": "CUTEst can be accessed in three ways.The first, easiest, and recommended for most users, is using the NLPModels.jl. This is recommended because if you develop something for this an NLPModel, then it can work with CUTEst, but also with other models.\nThe second is the core interface, which is just a wrapper of the Fortran functions, and is not recommended unless you really need and know what you're doing.\nThe third is something in the middle, which we called specialized interface. It follows the same naming as the core functions, but it is more accessible, from the Julia point of view."
},

{
    "location": "tutorial.html#NLPModels-interface-1",
    "page": "Tutorial",
    "title": "NLPModels interface",
    "category": "section",
    "text": "NLPModels defines an abstract interface to access the objective, constraints, derivatives, etc. of the problem. A reference guide is available to check what you need.Once CUTEst has been installed, open a problem withusing CUTEst\n\nnlp = CUTEstModel(\"ROSENBR\")That's it. You can use nlp like any other NLPModel, with one important exception. You have to finalize the model after using it. To be exact, you have to finalize it before opening a new one. There is no problem in closing Julia before finalizing it, for instance.finalize(nlp)Being a NLPModel means that everything created for an AbstractNLPModel will work for CUTEstModel. For instance, Optimize.jl has implementations of optimization methods for AbstractNLPModels.Let's make some demonstration of the CUTEstModel.using CUTEst\n\nnlp = CUTEstModel(\"ROSENBR\")\nprintln(\"x0 = $( nlp.meta.x0 )\")\nprintln(\"fx = $( obj(nlp, nlp.meta.x0) )\")\nprintln(\"gx = $( grad(nlp, nlp.meta.x0) )\")\nprintln(\"Hx = $( hess(nlp, nlp.meta.x0) )\")Remember to check the API in case of doubts about these functions.Notice how hess returns a lower triangle matrix. For decompositions that should be enough. For iterative solvers, you may want nabla^2 f(x) v instead, so only the lower triangle won't do. But you do havev = ones(nlp.meta.nvar)\nhprod(nlp, nlp.meta.x0, v)You can also use a LinearOperator,using LinearOperators\nn = nlp.meta.nvar\n\nH = hess_op(nlp, nlp.meta.x0)\nH * vThis way, you can use a Krylov method to solve the linear system with the Hessian as matrix. For instance, here is an example computation of a Newton trust-region step.using Krylov\n\nDelta = 10.0\nx = nlp.meta.x0\nprintln(\"0: x = $x\")\nfor i = 1:5\n  print(\"$i: \")\n  H = hess_op(nlp, x)\n  d, stats = Krylov.cg(H, -grad(nlp, x), radius=Delta)\n  x = x + d\n  println(\"x = $x\")\nendfinalize(nlp)There is no difference in calling a constrained problem, only that some additional functions are available.using CUTEst\n\nnlp = CUTEstModel(\"HS35\")x = nlp.meta.x0\n\ncons(nlp, x)jac(nlp, x)To find out whether these constraints are equalities or inequalities we can check nlp.metaprint(nlp.meta)finalize(nlp)"
},

{
    "location": "tutorial.html#Selection-tool-1",
    "page": "Tutorial",
    "title": "Selection tool",
    "category": "section",
    "text": "CUTEst comes with a simple selection tool. It uses a static file generated from the original CLASSF.DB and an execution of each problem.The selection tool works like a filter on the complete set of problems. Using the tool without arguments will return the complete set of problems.using CUTEst # hide\nproblems = CUTEst.select()\nlength(problems)The list of keyword arguments to filter the problems is given below, with their default value.argument default description\nmin_var 0 Minimum number of variables\nmax_var Inf Maximum number of variables\nmin_con 0 Minimum number of constraints (not bounds)\nmax_con Inf Maximum number of constraints\nobjtype all types Type of the objective function. See below.\ncontype all types Type of the constraints. See below.\nonly_free_var false Whether to exclude problems with bounded variables.\nonly_bnd_var false Whether to exclude problem with any free variables.\nonly_linear_con false Whether to exclude problems with nonlinear constraints.\nonly_nonlinear_con false Whether to exclude problems with any linear constraints.\nonly_equ_con false Whether to exclude problems with inequality constraints\nonly_ineq_con false Whether to exclude problems with equality constraints\ncustom_filter nothing A custom filter to be applied to the entries. This requires knowledge of the inner structure, and is present only because we haven't implemented every useful combination yet. We welcome pull-requests with implementations of additional queries.objtype description\n\"none\" or \"N\" There is no objective function.\n\"constants\" or \"C\" The objective function is constant.\n\"linear\" or \"L\" The objective function is linear.\n\"quadratic\" or \"Q\" The objective function is quadratic.\n\"sum_of_squares\" or \"S\" The objective function is a sum of squares.\n\"other\" or \"O\" The objective function is none of the above.contype description\n\"unc\" or \"U\" There are no constraints nor bounds on the variables.\n\"fixed_vars\" or \"X\" The only constraints are fixed variables.\n\"bounds\" or \"B\" The only constraints are bounds on the variables.\n\"network\" or \"N\" The constraints represent the adjacency matrix of a linear network.\n\"linear\" or \"L\" The constraints are linear.\n\"quadratic\" or \"Q\" The constraints are quadratic.\n\"other\" or \"O\" The constraints are more general than any of the above.The selection tool is not as complete as we would like. Some combinations are still hard to create. Below we create some of the simpler ones."
},

{
    "location": "tutorial.html#Unconstrained-problems-1",
    "page": "Tutorial",
    "title": "Unconstrained problems",
    "category": "section",
    "text": "No constraints and no bounds. There are two options:problems = CUTEst.select(max_con=0, only_free_var=true)\nlength(problems)problems = CUTEst.select(contype=\"unc\")\nlength(problems)"
},

{
    "location": "tutorial.html#Equality/Inequality-constrainted-problems-with-unbounded-variables-1",
    "page": "Tutorial",
    "title": "Equality/Inequality constrainted problems with unbounded variables",
    "category": "section",
    "text": "problems = CUTEst.select(min_con=1, only_equ_con=true, only_free_var=true)\nlength(problems)problems = CUTEst.select(min_con=1, only_ineq_con=true, only_free_var=true)\nlength(problems)"
},

{
    "location": "tutorial.html#Size-range-1",
    "page": "Tutorial",
    "title": "Size range",
    "category": "section",
    "text": "problems = CUTEst.select(min_var=1000, max_var=2000, min_con=100, max_con=500)\nlength(problems)"
},

{
    "location": "tutorial.html#Sum-of-squares-problems-with-bounds-1",
    "page": "Tutorial",
    "title": "Sum-of-squares problems with bounds",
    "category": "section",
    "text": "problems = CUTEst.select(objtype=\"sum_of_squares\", contype=\"bounds\")\nlength(problems)"
},

{
    "location": "tutorial.html#Quadratic-programming-with-linear-constraints.-1",
    "page": "Tutorial",
    "title": "Quadratic programming with linear constraints.",
    "category": "section",
    "text": "problems = CUTEst.select(objtype=\"quadratic\", contype=\"linear\")\nlength(problems)"
},

{
    "location": "api.html#",
    "page": "API",
    "title": "API",
    "category": "page",
    "text": ""
},

{
    "location": "api.html#API-1",
    "page": "API",
    "title": "API",
    "category": "section",
    "text": ""
},

{
    "location": "api.html#NLPModels.obj",
    "page": "API",
    "title": "NLPModels.obj",
    "category": "Function",
    "text": "f = obj(nlp, x)\n\nEvaluate f(x), the objective function of nlp at x.\n\n\n\n"
},

{
    "location": "api.html#NLPModels.grad",
    "page": "API",
    "title": "NLPModels.grad",
    "category": "Function",
    "text": "g = grad(nlp, x)\n\nEvaluate nabla f(x), the gradient of the objective function at x.\n\n\n\n"
},

{
    "location": "api.html#NLPModels.grad!",
    "page": "API",
    "title": "NLPModels.grad!",
    "category": "Function",
    "text": "g = grad!(nlp, x, g)\n\nEvaluate nabla f(x), the gradient of the objective function at x in place.\n\n\n\n"
},

{
    "location": "api.html#NLPModels.cons",
    "page": "API",
    "title": "NLPModels.cons",
    "category": "Function",
    "text": "cons(nlp, x, jac)\n\nComputes the constraint vector and, if jac is true, the Jacobian in internal sparse format. Usage:\n\nc, J = cons(nlp, x, true)\nc = cons(nlp, x, false)\n\nnlp:  [IN] CUTEstModel\nx:    [IN] Array{Float64, 1}\njac:  [IN] Bool\nc:    [OUT] Array{Float64, 1}\nJ:    [OUT] Base.SparseMatrix.SparseMatrixCSC{Float64,Int32}\n\n\n\nc = cons(nlp, x)\n\nEvaluate c(x), the constraints at x.\n\n\n\n"
},

{
    "location": "api.html#NLPModels.cons!",
    "page": "API",
    "title": "NLPModels.cons!",
    "category": "Function",
    "text": "c = cons!(nlp, x, c)\n\nEvaluate c(x), the constraints at x in place.\n\n\n\n"
},

{
    "location": "api.html#NLPModels.jac_coord",
    "page": "API",
    "title": "NLPModels.jac_coord",
    "category": "Function",
    "text": "(rows,cols,vals) = jac_coord(nlp, x)\n\nEvaluate nabla c(x), the constraint's Jacobian at x in sparse coordinate format.\n\n\n\n"
},

{
    "location": "api.html#NLPModels.jac",
    "page": "API",
    "title": "NLPModels.jac",
    "category": "Function",
    "text": "Jx = jac(nlp, x)\n\nEvaluate nabla c(x), the constraint's Jacobian at x as a sparse matrix.\n\n\n\n"
},

{
    "location": "api.html#NLPModels.jac_op",
    "page": "API",
    "title": "NLPModels.jac_op",
    "category": "Function",
    "text": "J = jac_op(nlp, x)\n\nReturn the Jacobian at x as a linear operator. The resulting object may be used as if it were a matrix, e.g., J * v or J' * v.\n\n\n\n"
},

{
    "location": "api.html#NLPModels.jac_op!",
    "page": "API",
    "title": "NLPModels.jac_op!",
    "category": "Function",
    "text": "J = jac_op!(nlp, x, Jv, Jtv)\n\nReturn the Jacobian at x as a linear operator. The resulting object may be used as if it were a matrix, e.g., J * v or J' * v. The values Jv and Jtv are used as preallocated storage for the operations.\n\n\n\n"
},

{
    "location": "api.html#NLPModels.jprod",
    "page": "API",
    "title": "NLPModels.jprod",
    "category": "Function",
    "text": "Jv = jprod(nlp, x, v)\n\nEvaluate nabla c(x)v, the Jacobian-vector product at x.\n\n\n\n"
},

{
    "location": "api.html#NLPModels.jprod!",
    "page": "API",
    "title": "NLPModels.jprod!",
    "category": "Function",
    "text": "Jv = jprod!(nlp, x, v, Jv)\n\nEvaluate nabla c(x)v, the Jacobian-vector product at x in place.\n\n\n\n"
},

{
    "location": "api.html#NLPModels.jtprod",
    "page": "API",
    "title": "NLPModels.jtprod",
    "category": "Function",
    "text": "Jtv = jtprod(nlp, x, v, Jtv)\n\nEvaluate nabla c(x)^Tv, the transposed-Jacobian-vector product at x.\n\n\n\n"
},

{
    "location": "api.html#NLPModels.jtprod!",
    "page": "API",
    "title": "NLPModels.jtprod!",
    "category": "Function",
    "text": "Jtv = jtprod!(nlp, x, v, Jtv)\n\nEvaluate nabla c(x)^Tv, the transposed-Jacobian-vector product at x in place.\n\n\n\n"
},

{
    "location": "api.html#NLPModels.hess_coord",
    "page": "API",
    "title": "NLPModels.hess_coord",
    "category": "Function",
    "text": "(rows,cols,vals) = hess_coord(nlp, x; obj_weight=1.0, y=zeros)\n\nEvaluate the Lagrangian Hessian at (x,y) in sparse coordinate format, with objective function scaled by obj_weight, i.e.,\n\n\\[ \\nabla^2L(x,y) = \\sigma * \\nabla^2 f(x) + \\sum_{i=1}^m y_i\\nabla^2 c_i(x), \\]\n\nwith σ = obj_weight. Only the lower triangle is returned.\n\n\n\n"
},

{
    "location": "api.html#NLPModels.hess",
    "page": "API",
    "title": "NLPModels.hess",
    "category": "Function",
    "text": "Hx = hess(nlp, x; obj_weight=1.0, y=zeros)\n\nEvaluate the Lagrangian Hessian at (x,y) as a sparse matrix, with objective function scaled by obj_weight, i.e.,\n\n\\[ \\nabla^2L(x,y) = \\sigma * \\nabla^2 f(x) + \\sum_{i=1}^m y_i\\nabla^2 c_i(x), \\]\n\nwith σ = obj_weight. Only the lower triangle is returned.\n\n\n\n"
},

{
    "location": "api.html#NLPModels.hess_op",
    "page": "API",
    "title": "NLPModels.hess_op",
    "category": "Function",
    "text": "H = hess_op(nlp, x; obj_weight=1.0, y=zeros)\n\nReturn the Lagrangian Hessian at (x,y) with objective function scaled by obj_weight as a linear operator. The resulting object may be used as if it were a matrix, e.g., H * v. The linear operator H represents\n\n\\[ \\nabla^2L(x,y) = \\sigma * \\nabla^2 f(x) + \\sum_{i=1}^m y_i\\nabla^2 c_i(x), \\]\n\nwith σ = obj_weight.\n\n\n\n"
},

{
    "location": "api.html#NLPModels.hess_op!",
    "page": "API",
    "title": "NLPModels.hess_op!",
    "category": "Function",
    "text": "H = hess_op!(nlp, x, Hv; obj_weight=1.0, y=zeros)\n\nReturn the Lagrangian Hessian at (x,y) with objective function scaled by obj_weight as a linear operator, and storing the result on Hv. The resulting object may be used as if it were a matrix, e.g., w = H * v. The vector Hv is used as preallocated storage for the operation.  The linear operator H represents\n\n\\[ \\nabla^2L(x,y) = \\sigma * \\nabla^2 f(x) + \\sum_{i=1}^m y_i\\nabla^2 c_i(x), \\]\n\nwith σ = obj_weight.\n\n\n\n"
},

{
    "location": "api.html#NLPModels.hprod",
    "page": "API",
    "title": "NLPModels.hprod",
    "category": "Function",
    "text": "Hv = hprod(nlp, x, v; obj_weight=1.0, y=zeros)\n\nEvaluate the product of the Lagrangian Hessian at (x,y) with the vector v, with objective function scaled by obj_weight, i.e.,\n\n\\[ \\nabla^2L(x,y) = \\sigma * \\nabla^2 f(x) + \\sum_{i=1}^m y_i\\nabla^2 c_i(x), \\]\n\nwith σ = obj_weight.\n\n\n\n"
},

{
    "location": "api.html#NLPModels.hprod!",
    "page": "API",
    "title": "NLPModels.hprod!",
    "category": "Function",
    "text": "Hv = hprod!(nlp, x, v, Hv; obj_weight=1.0, y=zeros)\n\nEvaluate the product of the Lagrangian Hessian at (x,y) with the vector v in place, with objective function scaled by obj_weight, i.e.,\n\n\\[ \\nabla^2L(x,y) = \\sigma * \\nabla^2 f(x) + \\sum_{i=1}^m y_i\\nabla^2 c_i(x), \\]\n\nwith σ = obj_weight.\n\n\n\n"
},

{
    "location": "api.html#NLPModels.NLPtoMPB",
    "page": "API",
    "title": "NLPModels.NLPtoMPB",
    "category": "Function",
    "text": "mp = NLPtoMPB(nlp, solver)\n\nReturn a MathProgBase model corresponding to an AbstractNLPModel.\n\nArguments\n\nnlp::AbstractNLPModel\nsolver::AbstractMathProgSolver a solver instance, e.g., IpoptSolver()\n\nCurrently, all models are treated as nonlinear models.\n\nReturn values\n\nThe function returns a MathProgBase model mpbmodel such that it should be possible to call\n\nMathProgBase.optimize!(mpbmodel)\n\n\n\n"
},

{
    "location": "api.html#LinearOperators.reset!",
    "page": "API",
    "title": "LinearOperators.reset!",
    "category": "Function",
    "text": "reset!(counters)\n\nReset evaluation counters\n\n\n\n`reset!(nlp)\n\nReset evaluation count in nlp\n\n\n\n"
},

{
    "location": "api.html#NLPModels-API-1",
    "page": "API",
    "title": "NLPModels API",
    "category": "section",
    "text": "obj\ngrad\ngrad!\ncons\ncons!\njac_coord\njac\njac_op\njac_op!\njprod\njprod!\njtprod\njtprod!\nhess_coord\nhess\nhess_op\nhess_op!\nhprod\nhprod!\nNLPModels.NLPtoMPB\nNLPModels.reset!"
},

{
    "location": "api.html#NLPModels.objgrad",
    "page": "API",
    "title": "NLPModels.objgrad",
    "category": "Function",
    "text": "f, g = objgrad(nlp, x)\n\nEvaluate f(x) and nabla f(x) at x.\n\n\n\n"
},

{
    "location": "api.html#NLPModels.objcons",
    "page": "API",
    "title": "NLPModels.objcons",
    "category": "Function",
    "text": "f, c = objcons(nlp, x)\n\nEvaluate f(x) and c(x) at x.\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cons_coord",
    "page": "API",
    "title": "CUTEst.cons_coord",
    "category": "Function",
    "text": "cons_coord(nlp, x, jac)\n\nComputes the constraint vector and, if jac is true, the Jacobian in coordinate format. Usage:\n\nc, jrow, jcol, jval = cons_coord(nlp, x, true)\nc = cons_coord(nlp, x, false)\n\nnlp:  [IN] CUTEstModel\nx:    [IN] Array{Float64, 1}\njac:  [IN] Bool\nc:    [OUT] Array{Float64, 1}\njrow: [OUT] Array{Int32, 1}\njcol: [OUT] Array{Int32, 1}\njval: [OUT] Array{Float64, 1}\n\n\n\n"
},

{
    "location": "api.html#Extra-Julian-API-1",
    "page": "API",
    "title": "Extra Julian API",
    "category": "section",
    "text": "objgrad\nobjcons\ncons_coord"
},

{
    "location": "api.html#CUTEst.create_class-Tuple{}",
    "page": "API",
    "title": "CUTEst.create_class",
    "category": "Method",
    "text": "create_class()\n\nCreates the file classf.json, running each problem in $MASTSIF/CLASSF.DB and extracting the necessary information. It should be left alone, unless you think it is not updated. If you do, please open an issue at https://github.com/JuliaSmoothOptimizers/CUTEst.jl\n\n\n\n"
},

{
    "location": "api.html#CUTEst.select-Tuple{}",
    "page": "API",
    "title": "CUTEst.select",
    "category": "Method",
    "text": "select(;min_var=1, max_var=Inf, min_con=0, max_con=Inf,     objtype=, contype=,     only_free_var=false, only_bnd_var=false,     only_linear_con=false, only_nonlinear_con=false,     only_equ_con=false, only_ineq_con=false,     custom_filter=*)\n\nReturns a subset of the CUTEst problems using the classification file classf.json. This file is export together with the package, so if you have an old CUTEst installation, it can lead to inconsistencies.\n\nmin_var and max_var set the number of variables in the problem;\nmin_con and max_con set the number of constraints in the problem\n\n(e.g., use max_con=0 for unconstrained or min_con=1 for constrained)\n\nonly_* flags are self-explaining. Note that they appear in conflicting\n\npairs. Both can be false, but only one can be true.\n\nobjtype is the classification of the objective function according to the\n\nMASTSIF classification file. It can be a number, a symbol, a string, or an array of those.\n\n1, :none or \"none\" means there is no objective function;\n2, :constant or \"constant\" means the objective function is a constant;\n3, :linear or \"linear\" means the objective function is a linear functional;\n4, :quadratic or \"quadratic\" means the objective function is quadratic;\n5, :sum_of_squares or \"sum_of_squares\" means the objective function is a sum of squares\n6, :other or \"other\" means the objective function is none of the above.\n\ncontype is the classification of the constraints according to the same MASTSIF classification file.\n1, :unc or \"unc\" means there are no constraints at all;   2, :fixed_vars or \"fixed_vars\" means the only constraints are fixed variables;   3, :bounds or \"bounds\" means the only constraints are bounded variables;   4, :network or \"network\" means the constraints represent the adjacency matrix of a (linear) network;   5, :linear or \"linear\" means the constraints are linear;   6, :quadratic or \"quadratic\" means the constraints are quadratic;   7, :other or \"other\" means the constraints are more general.\ncustom_filter is a function to be applied to the problem data, which is a dict with the following fields:\n\"objtype\"           - String    one of the above objective function types   \"contype\"           - String    one of the above constraint types   \"regular\"           - Bool      whether the problem is regular or not   \"derivative_order\"  - Int       order of the highest derivative available   \"origin\"            - String    origin of the problem: \"academic\", \"modelling\" or \"real\"   \"has_interval_var\"  - Bool      whether it has interval variables   \"variables\"         - Dict with the following fields     \"can_choose\"      - Bool      whether you can change the number of variables via parameters     \"number\"          - Int       the number of variables (if can_choose, the default)     \"fixed\"           - Int       the number of fixed variables     \"free\"            - Int       the number of free variables     \"bounded_below\"   - Int       the number of variables bounded only from below     \"bounded_above\"   - Int       the number of variables bounded only from above     \"bounded_both\"    - Int       the number of variables bounded from below and above   \"constraints\"       - Dict with the following fields     \"can_choose\"      - Bool      whether you can change the number of constraints via parameters     \"number\"          - Int       the number of constraints (if can_choose, the default)     \"equality\"        - Int       the number of equality constraints     \"ineq_below\"      - Int       the number of inequalities of the form c(x) ≧ cl     \"ineq_above\"      - Int       the number of inequalities of the form c(x) ≦ cu     \"ineq_both\"       - Int       the number of inequalities of the form cl ≦ c(x) ≦ cu     \"linear\"          - Int       the number of linear constraints     \"nonlinear\"       - Int       the number of nonlinear constraints\n\nFor instance, if you'd like to choose only problems with fixed number of   variables, you can pass\n\ncustom_filter=x->x[\"variables\"][\"can_choose\"]==false\n\n\n\n"
},

{
    "location": "api.html#Select-tools-1",
    "page": "API",
    "title": "Select tools",
    "category": "section",
    "text": "Modules = [CUTEst]\nPages   = [\"classification.jl\"]\nOrder   = [:function]"
},

{
    "location": "api.html#CUTEst.ccfg-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,2},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.ccfg",
    "category": "Method",
    "text": "ccfg\n\nThe ccfg subroutine evaluates the values of the constraint functions of the problem decoded from a SIF file by the script sifdecoder at the point X, and possibly their gradients. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_ccfg\n\nUsage:\n\nccfg(io_err, n, m, x, c, jtrans, lcjac1, lcjac2, cjac, grad)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nm:       [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\nc:       [OUT] Array{Cdouble, 1}\njtrans:  [IN] Array{Cint, 1}\nlcjac1:  [IN] Array{Cint, 1}\nlcjac2:  [IN] Array{Cint, 1}\ncjac:    [OUT] Array{Cdouble, 2}\ngrad:    [IN] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ccfsg-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.ccfsg",
    "category": "Method",
    "text": "ccfsg\n\nThe ccfsg subroutine evaluates the values of the constraint functions of the problem decoded from a SIF file by the script sifdecoder at the point X, and possibly their gradients in the constrained minimization case. The gradients are stored in sparse format. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_ccfsg\n\nUsage:\n\nccfsg(io_err, n, m, x, c, nnzj, lj, j_val, j_var, j_fun, grad)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nm:       [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\nc:       [OUT] Array{Cdouble, 1}\nnnzj:    [OUT] Array{Cint, 1}\nlj:      [IN] Array{Cint, 1}\nj_val:   [OUT] Array{Cdouble, 1}\nj_var:   [OUT] Array{Cint, 1}\nj_fun:   [OUT] Array{Cint, 1}\ngrad:    [IN] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cchprods-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.cchprods",
    "category": "Method",
    "text": "cchprods\n\nThe cchprods subroutine forms the product of a vector with each of the Hessian matrix of the constraint functions c(x) corresponding to the problem decoded from a SIF file by the script sifdecoder at the point x= X. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_cchprods\n\nUsage:\n\ncchprods(io_err, n, m, goth, x, vector, lchp, chp_val, chp_ind, chp_ptr)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nm:       [IN] Array{Cint, 1}\ngoth:    [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\nvector:  [IN] Array{Cdouble, 1}\nlchp:    [IN] Array{Cint, 1}\nchp_val: [OUT] Array{Cdouble, 1}\nchp_ind: [IN] Array{Cint, 1}\nchp_ptr: [IN] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ccifg-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Float64,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.ccifg",
    "category": "Method",
    "text": "ccifg\n\nThe ccifg subroutine evaluates the value of a particular constraint function of the problem decoded from a SIF file by the script sifdecoder at the point X, and possibly its gradient in the constrained minimization case. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_ccifg\n\nUsage:\n\nccifg(io_err, n, icon, x, ci, gci, grad)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nicon:    [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\nci:      [OUT] Array{Cdouble, 1}\ngci:     [OUT] Array{Cdouble, 1}\ngrad:    [IN] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ccifsg-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.ccifsg",
    "category": "Method",
    "text": "ccifsg\n\nThe ccifsg subroutine evaluates the value of a particular constraint function of the problem decoded from a SIF file by the script sifdecoder at the point X, and possibly its gradient in the constrained minimization case. The gradient is stored in sparse format. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_ccifsg\n\nUsage:\n\nccifsg(io_err, n, icon, x, ci, nnzgci, lgci, gci_val, gci_var, grad)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nicon:    [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\nci:      [OUT] Array{Cdouble, 1}\nnnzgci:  [OUT] Array{Cint, 1}\nlgci:    [IN] Array{Cint, 1}\ngci_val: [OUT] Array{Cdouble, 1}\ngci_var: [OUT] Array{Cint, 1}\ngrad:    [IN] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cdh-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Int32,1},Array{Float64,2}}",
    "page": "API",
    "title": "CUTEst.cdh",
    "category": "Method",
    "text": "cdh\n\nThe cdh subroutine evaluates the Hessian matrix of the Lagrangian function l(x,y)=f(x)+yTc(x) for the problem decoded from a SIF file by the script sifdecoder at the point (x,y)= (X,Y). The matrix is stored as a dense matrix. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_cdh\n\nUsage:\n\ncdh(io_err, n, m, x, y, lh1, h_val)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nm:       [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\ny:       [IN] Array{Cdouble, 1}\nlh1:     [IN] Array{Cint, 1}\nh_val:   [OUT] Array{Cdouble, 2}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cdhc-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Int32,1},Array{Float64,2}}",
    "page": "API",
    "title": "CUTEst.cdhc",
    "category": "Method",
    "text": "cdhc\n\nThe cdhc subroutine evaluates the Hessian matrix of the constraint part of the Lagrangian function yTc(x) for the problem decoded from a SIF file by the script sifdecoder at the point (x,y)= (X,Y). The matrix is stored as a dense matrix. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_cdhc\n\nUsage:\n\ncdhc(io_err, n, m, x, y, lh1, h_val)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nm:       [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\ny:       [IN] Array{Cdouble, 1}\nlh1:     [IN] Array{Cint, 1}\nh_val:   [OUT] Array{Cdouble, 2}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cdimchp-Tuple{Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.cdimchp",
    "category": "Method",
    "text": "cdimchp\n\nThe cdimchp subroutine determines the number of nonzero elements required to store the products of the Hessian matrices of the constraint functions with a specified vector for the problem decoded into OUTSDIF.d in the constrained minimization case. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_cdimchp\n\nUsage:\n\ncdimchp(io_err, nnzchp)\n\nio_err:  [OUT] Array{Cint, 1}\nnnzchp:  [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cdimen-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.cdimen",
    "category": "Method",
    "text": "cdimen\n\nThe cdimen subroutine discovers how many variables and constraints are involved in the problem decoded from a SIF file by the script sifdecoder. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_cdimen\n\nUsage:\n\ncdimen(io_err, input, n, m)\n\nio_err:  [OUT] Array{Cint, 1}\ninput:   [IN] Array{Cint, 1}\nn:       [OUT] Array{Cint, 1}\nm:       [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cdimse-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.cdimse",
    "category": "Method",
    "text": "cdimse\n\nThe cdimse subroutine determines the number of nonzero elements required to store the Hessian matrix of the Lagrangian function for the problem decoded from a SIF file by the script sifdecoder. The matrix is stored in sparse \"finite element\" format H=eΣ1He, where each square symmetric element He involves a small subset of the rows of the Hessian matrix. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_cdimse\n\nUsage:\n\ncdimse(io_err, ne, he_val_ne, he_row_ne)\n\nio_err:    [OUT] Array{Cint, 1}\nne:        [OUT] Array{Cint, 1}\nhe_val_ne: [OUT] Array{Cint, 1}\nhe_row_ne: [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cdimsh-Tuple{Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.cdimsh",
    "category": "Method",
    "text": "cdimsh\n\nThe cdimsh subroutine determines the number of nonzero elements required to store the Hessian matrix of the Lagrangian function for the problem decoded into OUTSDIF.d in the constrained minimization case. The matrix is stored in sparse \"coordinate\" format. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_cdimsh\n\nUsage:\n\ncdimsh(io_err, nnzh)\n\nio_err:  [OUT] Array{Cint, 1}\nnnzh:    [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cdimsj-Tuple{Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.cdimsj",
    "category": "Method",
    "text": "cdimsj\n\nThe cdimsj subroutine determines the number of nonzero elements required to store the matrix of gradients of the objective function and constraint functions for the problem decoded into OUTSDIF.d in the constrained minimization case. The matrix is stored in sparse format. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_cdimsj\n\nUsage:\n\ncdimsj(io_err, nnzj)\n\nio_err:  [OUT] Array{Cint, 1}\nnnzj:    [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ceh-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.ceh",
    "category": "Method",
    "text": "ceh\n\nThe ceh subroutine evaluates the Hessian matrix of the Lagrangian function l(x,y)=f(x)+yTc(x) for the problem decoded into OUTSDIF.d at the point (x,y)= (X,Y). This Hessian matrix is stored as a sparse matrix in finite element format H=eΣ1He, where each square symmetric element He involves a small subset of the rows of the Hessian matrix. The problem under consideration consists in minimizing (or maximizing) an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_ceh\n\nUsage:\n\nceh(io_err, n, m, x, y, ne, lhe_ptr, he_row_ptr, he_val_ptr, lhe_row,\n\nhe_row, lhe_val, he_val, byrows)\n\nio_err:     [OUT] Array{Cint, 1}\nn:          [IN] Array{Cint, 1}\nm:          [IN] Array{Cint, 1}\nx:          [IN] Array{Cdouble, 1}\ny:          [IN] Array{Cdouble, 1}\nne:         [OUT] Array{Cint, 1}\nlhe_ptr:    [IN] Array{Cint, 1}\nhe_row_ptr: [OUT] Array{Cint, 1}\nhe_val_ptr: [OUT] Array{Cint, 1}\nlhe_row:    [IN] Array{Cint, 1}\nhe_row:     [OUT] Array{Cint, 1}\nlhe_val:    [IN] Array{Cint, 1}\nhe_val:     [OUT] Array{Cdouble, 1}\nbyrows:     [IN] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cfn-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.cfn",
    "category": "Method",
    "text": "cfn\n\nThe cfn subroutine evaluates the value of the objective function and general constraint functions of the problem decoded from a SIF file by the script sifdecoder at the point X. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_cfn\n\nUsage:\n\ncfn(io_err, n, m, x, f, c)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nm:       [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\nf:       [OUT] Array{Cdouble, 1}\nc:       [OUT] Array{Cdouble, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cgr-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,2}}",
    "page": "API",
    "title": "CUTEst.cgr",
    "category": "Method",
    "text": "cgr\n\nThe cgr subroutine evaluates the gradients of the general constraints and of either the objective function f(x) or the Lagrangian function l(x,y)=f(x)+yTc(x) corresponding to the problem decoded from a SIF file by the script sifdecoder at the point (x,y)= (X,Y). The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_cgr\n\nUsage:\n\ncgr(io_err, n, m, x, y, grlagf, g, jtrans, lj1, lj2, j_val)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nm:       [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\ny:       [IN] Array{Cdouble, 1}\ngrlagf:  [IN] Array{Cint, 1}\ng:       [OUT] Array{Cdouble, 1}\njtrans:  [IN] Array{Cint, 1}\nlj1:     [IN] Array{Cint, 1}\nlj2:     [IN] Array{Cint, 1}\nj_val:   [OUT] Array{Cdouble, 2}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cgrdh-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,2},Array{Int32,1},Array{Float64,2}}",
    "page": "API",
    "title": "CUTEst.cgrdh",
    "category": "Method",
    "text": "cgrdh\n\nThe cgrdh subroutine evaluates the gradients of the general constraints and of either the objective function f(x) or the Lagrangian function l(x,y)=f(x)+yTc(x) corresponding to the problem decoded from a SIF file by the script sifdecoder at the point (x,y)= (X,Y). It also evaluates the Hessian matrix of the Lagrangian function at (x,y). The gradients and matrices are stored in a dense format. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_cgrdh\n\nUsage:\n\ncgrdh(io_err, n, m, x, y, grlagf, g, jtrans, lj1, lj2, j_val, lh1, h_val)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nm:       [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\ny:       [IN] Array{Cdouble, 1}\ngrlagf:  [IN] Array{Cint, 1}\ng:       [OUT] Array{Cdouble, 1}\njtrans:  [IN] Array{Cint, 1}\nlj1:     [IN] Array{Cint, 1}\nlj2:     [IN] Array{Cint, 1}\nj_val:   [OUT] Array{Cdouble, 2}\nlh1:     [IN] Array{Cint, 1}\nh_val:   [OUT] Array{Cdouble, 2}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.chcprod-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Float64,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.chcprod",
    "category": "Method",
    "text": "chcprod\n\nThe chcprod subroutine forms the product of a vector with the Hessian matrix of the constraint part of the Lagrangian function yTc(x) of the problem decoded from a SIF file by the script sifdecoder at the point (x,y)= (X,Y). The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_chcprod\n\nUsage:\n\nchcprod(io_err, n, m, goth, x, y, vector, result)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nm:       [IN] Array{Cint, 1}\ngoth:    [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\ny:       [IN] Array{Cdouble, 1}\nvector:  [IN] Array{Cdouble, 1}\nresult:  [OUT] Array{Cdouble, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.chprod-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Float64,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.chprod",
    "category": "Method",
    "text": "chprod\n\nThe chprod subroutine forms the product of a vector with the Hessian matrix of the Lagrangian function l(x,y)=f(x)+yTc(x) corresponding to the problem decoded from a SIF file by the script sifdecoder at the point (x,y)= (X,Y). The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_chprod\n\nUsage:\n\nchprod(io_err, n, m, goth, x, y, vector, result)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nm:       [IN] Array{Cint, 1}\ngoth:    [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\ny:       [IN] Array{Cdouble, 1}\nvector:  [IN] Array{Cdouble, 1}\nresult:  [OUT] Array{Cdouble, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cidh-Tuple{Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Float64,2}}",
    "page": "API",
    "title": "CUTEst.cidh",
    "category": "Method",
    "text": "cidh\n\nThe cidh subroutine evaluates the Hessian matrix of either the objective function or a constraint function for the problem decoded from a SIF file by the script sifdecoder at the point X, and possibly its gradient. The matrix is stored as a dense matrix. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_cidh\n\nUsage:\n\ncidh(io_err, n, x, iprob, lh1, h)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\niprob:   [IN] Array{Cint, 1}\nlh1:     [IN] Array{Cint, 1}\nh:       [OUT] Array{Cdouble, 2}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cish-Tuple{Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.cish",
    "category": "Method",
    "text": "cish\n\nThe cish subroutine evaluates the Hessian of a particular constraint function or the objective function for the problem decoded from a SIF file by the script sifdecoder at the point X, and possibly its gradient. The matrix is stored in sparse format. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_cish\n\nUsage:\n\ncish(io_err, n, x, iprob, nnzh, lh, h_val, h_row, h_col)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\niprob:   [IN] Array{Cint, 1}\nnnzh:    [OUT] Array{Cint, 1}\nlh:      [IN] Array{Cint, 1}\nh_val:   [OUT] Array{Cdouble, 1}\nh_row:   [OUT] Array{Cint, 1}\nh_col:   [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cjprod-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Int32,1},Array{Float64,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.cjprod",
    "category": "Method",
    "text": "cjprod\n\nThe cjprod subroutine forms the product of a vector with the Jacobian matrix, or with its transpose, of the constraint functions of the problem decoded from a SIF file by the script sifdecoder evaluated at the point X. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_cjprod\n\nUsage:\n\ncjprod(io_err, n, m, gotj, jtrans, x, vector, lvector, result, lresult)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nm:       [IN] Array{Cint, 1}\ngotj:    [IN] Array{Cint, 1}\njtrans:  [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\nvector:  [IN] Array{Cdouble, 1}\nlvector: [IN] Array{Cint, 1}\nresult:  [OUT] Array{Cdouble, 1}\nlresult: [IN] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.clfg-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Float64,1},Array{Float64,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.clfg",
    "category": "Method",
    "text": "clfg\n\nThe clfg subroutine evaluates the value of the Lagrangian function l(x,y)=f(x)+yTc(x) for the problem decoded from a SIF file by the script sifdecoder at the point (X,Y), and possibly its gradient. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_clfg\n\nUsage:\n\nclfg(io_err, n, m, x, y, f, g, grad)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nm:       [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\ny:       [IN] Array{Cdouble, 1}\nf:       [OUT] Array{Cdouble, 1}\ng:       [OUT] Array{Cdouble, 1}\ngrad:    [IN] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cnames-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{UInt8,1},Array{UInt8,2},Array{UInt8,2}}",
    "page": "API",
    "title": "CUTEst.cnames",
    "category": "Method",
    "text": "cnames\n\nThe cnames subroutine obtains the names of the problem, its variables and general constraints. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_cnames\n\nUsage:\n\ncnames(io_err, n, m, pname, vname, cname)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nm:       [IN] Array{Cint, 1}\npname:   [OUT] Array{UInt8, 1}\nvname:   [OUT] Array{UInt8, 1}\ncname:   [OUT] Array{UInt8, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cofg-Tuple{Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Float64,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.cofg",
    "category": "Method",
    "text": "cofg\n\nThe cofg subroutine evaluates the value of the objective function of the problem decoded from a SIF file by the script sifdecoder at the point X, and possibly its gradient. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_cofg\n\nUsage:\n\ncofg(io_err, n, x, f, g, grad)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\nf:       [OUT] Array{Cdouble, 1}\ng:       [OUT] Array{Cdouble, 1}\ngrad:    [IN] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cofsg-Tuple{Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.cofsg",
    "category": "Method",
    "text": "cofsg\n\nThe cofsg subroutine evaluates the value of the objective function of the problem decoded from a SIF file by the script sifdecoder at the point X, and possibly its gradient in sparse format. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_cofsg\n\nUsage:\n\ncofsg(io_err, n, x, f, nnzg, lg, g_val, g_var, grad)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\nf:       [OUT] Array{Cdouble, 1}\nnnzg:    [OUT] Array{Cint, 1}\nlg:      [IN] Array{Cint, 1}\ng_val:   [OUT] Array{Cdouble, 1}\ng_var:   [OUT] Array{Cint, 1}\ngrad:    [IN] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.connames-Tuple{Array{Int32,1},Array{Int32,1},Array{UInt8,2}}",
    "page": "API",
    "title": "CUTEst.connames",
    "category": "Method",
    "text": "connames\n\nThe connames subroutine obtains the names of the general constraints of the problem. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_connames\n\nUsage:\n\nconnames(io_err, m, cname)\n\nio_err:  [OUT] Array{Cint, 1}\nm:       [IN] Array{Cint, 1}\ncname:   [OUT] Array{UInt8, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.creport-Tuple{Array{Int32,1},Array{Float64,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.creport",
    "category": "Method",
    "text": "creport\n\nThe creport subroutine obtains statistics concerning function evaluation and CPU time used for constrained optimization in a standardized format. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_creport\n\nUsage:\n\ncreport(io_err, calls, time)\n\nio_err:  [OUT] Array{Cint, 1}\ncalls:   [OUT] Array{Cdouble, 1}\ntime:    [OUT] Array{Cdouble, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.csetup-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Float64,1},Array{Float64,1},Array{Float64,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.csetup",
    "category": "Method",
    "text": "csetup\n\nThe csetup subroutine sets up the correct data structures for subsequent computations on the problem decoded from a SIF file by the script sifdecoder. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_csetup\n\nUsage:\n\ncsetup(io_err, input, out, io_buffer, n, m, x, x_l, x_u, y, c_l, c_u, equatn,\n\nlinear, e_order, l_order, v_order)\n\nio_err:    [OUT] Array{Cint, 1}\ninput:     [IN] Array{Cint, 1}\nout:       [IN] Array{Cint, 1}\nio_buffer: [IN] Array{Cint, 1}\nn:         [IN] Array{Cint, 1}\nm:         [IN] Array{Cint, 1}\nx:         [OUT] Array{Cdouble, 1}\nx_l:       [OUT] Array{Cdouble, 1}\nx_u:       [OUT] Array{Cdouble, 1}\ny:         [OUT] Array{Cdouble, 1}\nc_l:       [OUT] Array{Cdouble, 1}\nc_u:       [OUT] Array{Cdouble, 1}\nequatn:    [OUT] Array{Cint, 1}\nlinear:    [OUT] Array{Cint, 1}\ne_order:   [IN] Array{Cint, 1}\nl_order:   [IN] Array{Cint, 1}\nv_order:   [IN] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.csgr-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.csgr",
    "category": "Method",
    "text": "csgr\n\nThe csgr subroutine evaluates the gradients of the general constraints and of either the objective function or the Lagrangian function l(x,y)=f(x)+yTc(x) corresponding to the problem decoded from a SIF file by the script sifdecoder at the point (x,y)= (X,Y). It also evaluates the Hessian matrix of the Lagrangian function at (x,y). The gradients are stored in a sparse format. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_csgr\n\nUsage:\n\ncsgr(io_err, n, m, x, y, grlagf, nnzj, lj, j_val, j_var, j_fun)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nm:       [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\ny:       [IN] Array{Cdouble, 1}\ngrlagf:  [IN] Array{Cint, 1}\nnnzj:    [OUT] Array{Cint, 1}\nlj:      [IN] Array{Cint, 1}\nj_val:   [OUT] Array{Cdouble, 1}\nj_var:   [OUT] Array{Cint, 1}\nj_fun:   [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.csgreh-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.csgreh",
    "category": "Method",
    "text": "csgreh\n\nThe csgreh subroutine evaluates both the gradients of the general constraint functions and the Hessian matrix of the Lagrangian function l(x,y)=f(x)+yTc(x) for the problem decoded into OUTSDIF.d at the point (x,y)= (X,Y). This Hessian matrix is stored as a sparse matrix in finite element format H=eΣ1He, where each square symmetric element He involves a small subset of the rows of the Hessian matrix. The subroutine also obtains the gradient of either the objective function or the Lagrangian function, stored in a sparse format. The problem under consideration consists in minimizing (or maximizing) an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_csgreh\n\nUsage:\n\ncsgreh(io_err, n, m, x, y, grlagf, nnzj, lj, j_val, j_var, j_fun, ne,\n\nlhe_ptr, he_row_ptr, he_val_ptr, lhe_row, he_row, lhe_val, he_val, byrows)\n\nio_err:     [OUT] Array{Cint, 1}\nn:          [IN] Array{Cint, 1}\nm:          [IN] Array{Cint, 1}\nx:          [IN] Array{Cdouble, 1}\ny:          [IN] Array{Cdouble, 1}\ngrlagf:     [IN] Array{Cint, 1}\nnnzj:       [OUT] Array{Cint, 1}\nlj:         [IN] Array{Cint, 1}\nj_val:      [OUT] Array{Cdouble, 1}\nj_var:      [OUT] Array{Cint, 1}\nj_fun:      [OUT] Array{Cint, 1}\nne:         [OUT] Array{Cint, 1}\nlhe_ptr:    [IN] Array{Cint, 1}\nhe_row_ptr: [OUT] Array{Cint, 1}\nhe_val_ptr: [OUT] Array{Cint, 1}\nlhe_row:    [IN] Array{Cint, 1}\nhe_row:     [OUT] Array{Cint, 1}\nlhe_val:    [IN] Array{Cint, 1}\nhe_val:     [OUT] Array{Cdouble, 1}\nbyrows:     [IN] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.csgrsh-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.csgrsh",
    "category": "Method",
    "text": "csgrsh\n\nThe csgrsh subroutine evaluates the gradients of the general constraints, the Hessian matrix of the Lagrangian function l(x,y)=f(x)+yTc(x) and the gradient of either the objective function or the Lagrangian corresponding to the problem decoded from a SIF file by the script sifdecoder at the point (x,y)= (X,Y). The data is stored in sparse format. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_csgrsh\n\nUsage:\n\ncsgrsh(io_err, n, m, x, y, grlagf, nnzj, lj, j_val, j_var, j_fun, nnzh, lh,\n\nh_val, h_row, h_col)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nm:       [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\ny:       [IN] Array{Cdouble, 1}\ngrlagf:  [IN] Array{Cint, 1}\nnnzj:    [OUT] Array{Cint, 1}\nlj:      [IN] Array{Cint, 1}\nj_val:   [OUT] Array{Cdouble, 1}\nj_var:   [OUT] Array{Cint, 1}\nj_fun:   [OUT] Array{Cint, 1}\nnnzh:    [OUT] Array{Cint, 1}\nlh:      [IN] Array{Cint, 1}\nh_val:   [OUT] Array{Cdouble, 1}\nh_row:   [OUT] Array{Cint, 1}\nh_col:   [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.csh-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.csh",
    "category": "Method",
    "text": "csh\n\nThe csh subroutine evaluates the Hessian of the Lagrangian function l(x,y)=f(x)+yTc(x) for the problem decoded from a SIF file by the script sifdecoder at the point (x,y)= (X,Y). The matrix is stored in sparse format. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_csh\n\nUsage:\n\ncsh(io_err, n, m, x, y, nnzh, lh, h_val, h_row, h_col)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nm:       [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\ny:       [IN] Array{Cdouble, 1}\nnnzh:    [OUT] Array{Cint, 1}\nlh:      [IN] Array{Cint, 1}\nh_val:   [OUT] Array{Cdouble, 1}\nh_row:   [OUT] Array{Cint, 1}\nh_col:   [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cshc-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.cshc",
    "category": "Method",
    "text": "cshc\n\nThe cshc subroutine evaluates the Hessian matrix of the constraint part of the Lagrangian function yTc(x) for the problem decoded from a SIF file by the script sifdecoder at the point (x,y)= (X,Y). The matrix is stored in sparse format. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_cshc\n\nUsage:\n\ncshc(io_err, n, m, x, y, nnzh, lh, h_val, h_row, h_col)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nm:       [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\ny:       [IN] Array{Cdouble, 1}\nnnzh:    [OUT] Array{Cint, 1}\nlh:      [IN] Array{Cint, 1}\nh_val:   [OUT] Array{Cdouble, 1}\nh_row:   [OUT] Array{Cint, 1}\nh_col:   [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cshcprod-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.cshcprod",
    "category": "Method",
    "text": "cshcprod\n\nThe cshcprod subroutine forms the product of a sparse vector with the Hessian matrix of the constraint part of the Lagrangian function yTc(x) corresponding to the problem decoded from a SIF file by the script sifdecoder at the point (x,y)= (X,Y). The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_cshcprod\n\nUsage:\n\ncshcprod(io_err, n, m, goth, x, y, nnz_vector, index_nz_vector, vector,\n\nnnz_result, index_nz_result, result)\n\nio_err:          [OUT] Array{Cint, 1}\nn:               [IN] Array{Cint, 1}\nm:               [IN] Array{Cint, 1}\ngoth:            [IN] Array{Cint, 1}\nx:               [IN] Array{Cdouble, 1}\ny:               [IN] Array{Cdouble, 1}\nnnz_vector:      [IN] Array{Cint, 1}\nindex_nz_vector: [IN] Array{Cint, 1}\nvector:          [IN] Array{Cdouble, 1}\nnnz_result:      [OUT] Array{Cint, 1}\nindex_nz_result: [OUT] Array{Cint, 1}\nresult:          [OUT] Array{Cdouble, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cshp-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.cshp",
    "category": "Method",
    "text": "cshp\n\nThe cshp subroutine evaluates the sparsity pattern of the Hessian of the Lagrangian function l(x,y)=f(x)+yTc(x) for the problem, decoded from a SIF file by the script sifdecoder, in coordinate format. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_cshp\n\nUsage:\n\ncshp(io_err, n, nnzh, lh, h_row, h_col)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nnnzh:    [OUT] Array{Cint, 1}\nlh:      [IN] Array{Cint, 1}\nh_row:   [OUT] Array{Cint, 1}\nh_col:   [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cshprod-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.cshprod",
    "category": "Method",
    "text": "cshprod\n\nThe cshprod subroutine forms the product of a sparse vector with the Hessian matrix of the Lagrangian function l(x,y)=f(x)+yTc(x) corresponding to the problem decoded from a SIF file by the script sifdecoder at the point (x,y)= (X,Y). The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_cshprod\n\nUsage:\n\ncshprod(io_err, n, m, goth, x, y, nnz_vector, index_nz_vector, vector,\n\nnnz_result, index_nz_result, result)\n\nio_err:          [OUT] Array{Cint, 1}\nn:               [IN] Array{Cint, 1}\nm:               [IN] Array{Cint, 1}\ngoth:            [IN] Array{Cint, 1}\nx:               [IN] Array{Cdouble, 1}\ny:               [IN] Array{Cdouble, 1}\nnnz_vector:      [IN] Array{Cint, 1}\nindex_nz_vector: [IN] Array{Cint, 1}\nvector:          [IN] Array{Cdouble, 1}\nnnz_result:      [OUT] Array{Cint, 1}\nindex_nz_result: [OUT] Array{Cint, 1}\nresult:          [OUT] Array{Cdouble, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.csjprod-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.csjprod",
    "category": "Method",
    "text": "csjprod\n\nThe csjprod subroutine forms the product of a sparse vector with the Jacobian matrix, or with its transpose, of the constraint functions of the problem decoded from a SIF file by the script sifdecoder evaluated at the point X. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_csjprod\n\nUsage:\n\ncsjprod(io_err, n, m, gotj, jtrans, x, nnz_vector, index_nz_vector, vector,\n\nlvector, nnz_result, index_nz_result, result, lresult)\n\nio_err:          [OUT] Array{Cint, 1}\nn:               [IN] Array{Cint, 1}\nm:               [IN] Array{Cint, 1}\ngotj:            [IN] Array{Cint, 1}\njtrans:          [IN] Array{Cint, 1}\nx:               [IN] Array{Cdouble, 1}\nnnz_vector:      [IN] Array{Cint, 1}\nindex_nz_vector: [IN] Array{Cint, 1}\nvector:          [IN] Array{Cdouble, 1}\nlvector:         [IN] Array{Cint, 1}\nnnz_result:      [OUT] Array{Cint, 1}\nindex_nz_result: [OUT] Array{Cint, 1}\nresult:          [OUT] Array{Cdouble, 1}\nlresult:         [IN] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cstats-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.cstats",
    "category": "Method",
    "text": "cstats\n\ncstats(io_err, nonlinear_variables_objective,\n\nnonlinear_variables_constraints, equality_constraints, linear_constraints)\n\nio_err:                          [OUT] Array{Cint, 1}\nnonlinear_variables_objective:   [OUT] Array{Cint, 1}\nnonlinear_variables_constraints: [OUT] Array{Cint, 1}\nequality_constraints:            [OUT] Array{Cint, 1}\nlinear_constraints:              [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cterminate-Tuple{Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.cterminate",
    "category": "Method",
    "text": "cterminate\n\nThe uterminate subroutine deallocates all workspace arrays created since the last call to csetup.\n\nFor more information, run the shell command\n\nman cutest_cterminate\n\nUsage:\n\ncterminate(io_err)\n\nio_err:  [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cvartype-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.cvartype",
    "category": "Method",
    "text": "cvartype\n\nThe cvartype subroutine determines the type (continuous, 0-1, integer) of each variable involved in the problem decoded from a SIF file by the script sifdecoder. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_cvartype\n\nUsage:\n\ncvartype(io_err, n, x_type)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nx_type:  [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.pname-Tuple{Array{Int32,1},Array{Int32,1},Array{UInt8,1}}",
    "page": "API",
    "title": "CUTEst.pname",
    "category": "Method",
    "text": "pname\n\nThe pname subroutine obtains the name of the problem directly from the datafile OUTSDIF.d that was created by the script sifdecoder when decoding a SIF file. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_pname\n\nUsage:\n\npname(io_err, input, pname)\n\nio_err:  [OUT] Array{Cint, 1}\ninput:   [IN] Array{Cint, 1}\npname:   [OUT] Array{UInt8, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.probname-Tuple{Array{Int32,1},Array{UInt8,1}}",
    "page": "API",
    "title": "CUTEst.probname",
    "category": "Method",
    "text": "probname\n\nThe probname subroutine obtains the name of the problem. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_probname\n\nUsage:\n\nprobname(io_err, pname)\n\nio_err:  [OUT] Array{Cint, 1}\npname:   [OUT] Array{UInt8, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ubandh-Tuple{Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Float64,2},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.ubandh",
    "category": "Method",
    "text": "ubandh\n\nThe ubandh subroutine extracts the elements which lie within a band of given semi-bandwidth out of the Hessian matrix of the objective function of the problem decoded from a SIF file by the script sifdecoder at the point X. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to the simple bounds xl≤x≤xu. The objective function is group- partially separable.\n\nFor more information, run the shell command\n\nman cutest_ubandh\n\nUsage:\n\nubandh(io_err, n, x, semibandwidth, h_band, lbandh, max_semibandwidth)\n\nio_err:            [OUT] Array{Cint, 1}\nn:                 [IN] Array{Cint, 1}\nx:                 [IN] Array{Cdouble, 1}\nsemibandwidth:     [IN] Array{Cint, 1}\nh_band:            [OUT] Array{Cdouble, 2}\nlbandh:            [IN] Array{Cint, 1}\nmax_semibandwidth: [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.udh-Tuple{Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Float64,2}}",
    "page": "API",
    "title": "CUTEst.udh",
    "category": "Method",
    "text": "udh\n\nThe udh subroutine evaluates the Hessian matrix of the objective function of the problem decoded from a SIF file by the script sifdecoder at the point X. This Hessian matrix is stored as a dense matrix. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to the simple bounds xl≤x≤xu. The objective function is group-partially separable.\n\nFor more information, run the shell command\n\nman cutest_udh\n\nUsage:\n\nudh(io_err, n, x, lh1, h)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\nlh1:     [IN] Array{Cint, 1}\nh:       [OUT] Array{Cdouble, 2}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.udimen-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.udimen",
    "category": "Method",
    "text": "udimen\n\nThe udimen subroutine discovers how many variables are involved in the problem decoded from a SIF file by the script sifdecoder. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to the simple bounds xl≤x≤xu. The objective function is group-partially separable.\n\nFor more information, run the shell command\n\nman cutest_udimen\n\nUsage:\n\nudimen(io_err, input, n)\n\nio_err:  [OUT] Array{Cint, 1}\ninput:   [IN] Array{Cint, 1}\nn:       [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.udimse-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.udimse",
    "category": "Method",
    "text": "udimse\n\nThe udimse subroutine determine the number of nonzeros required to store the Hessian matrix of the objective function of the problem decoded from a SIF file by the script sifdecoder at the point X. This Hessian matrix is stored as a sparse matrix in finite element format H=eΣ1He, where each square symmetric element H_i involves a small subset of the rows of the Hessian matrix. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to the simple bounds xl≤x≤xu. The objective function is group-partially separable.\n\nFor more information, run the shell command\n\nman cutest_udimse\n\nUsage:\n\nudimse(io_err, ne, he_val_ne, he_row_ne)\n\nio_err:    [OUT] Array{Cint, 1}\nne:        [OUT] Array{Cint, 1}\nhe_val_ne: [OUT] Array{Cint, 1}\nhe_row_ne: [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.udimsh-Tuple{Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.udimsh",
    "category": "Method",
    "text": "udimsh\n\nThe udimsh subroutine determine the number of nonzeros required to store the Hessian matrix of the objective function of the problem decoded from a SIF file by the script sifdecoder at the point X. This Hessian matrix is stored as a sparse matrix in coordinate format. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to the simple bounds xl≤x≤xu. The objective function is group-partially separable.\n\nFor more information, run the shell command\n\nman cutest_udimsh\n\nUsage:\n\nudimsh(io_err, nnzh)\n\nio_err:  [OUT] Array{Cint, 1}\nnnzh:    [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ueh-Tuple{Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.ueh",
    "category": "Method",
    "text": "ueh\n\nThe ueh subroutine evaluates the Hessian matrix of the objective function of the problem decoded from a SIF file by the script sifdecoder at the point X. This Hessian matrix is stored as a sparse matrix in finite element format H=eΣ1He, where each square symmetric element He involves a small subset of the rows of the Hessian matrix. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to the simple bounds xl≤x≤xu. The objective function is group-partially separable.\n\nFor more information, run the shell command\n\nman cutest_ueh\n\nUsage:\n\nueh(io_err, n, x, ne, lhe_ptr, he_row_ptr, he_val_ptr, lhe_row, he_row,\n\nlhe_val, he_val, byrows)\n\nio_err:     [OUT] Array{Cint, 1}\nn:          [IN] Array{Cint, 1}\nx:          [IN] Array{Cdouble, 1}\nne:         [OUT] Array{Cint, 1}\nlhe_ptr:    [IN] Array{Cint, 1}\nhe_row_ptr: [OUT] Array{Cint, 1}\nhe_val_ptr: [OUT] Array{Cint, 1}\nlhe_row:    [IN] Array{Cint, 1}\nhe_row:     [OUT] Array{Cint, 1}\nlhe_val:    [IN] Array{Cint, 1}\nhe_val:     [OUT] Array{Cdouble, 1}\nbyrows:     [IN] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ufn-Tuple{Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.ufn",
    "category": "Method",
    "text": "ufn\n\nThe ufn subroutine evaluates the value of the objective function of the problem decoded from a SIF file by the script sifdecoder at the point X. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to the simple bounds xl≤x≤xu. The objective function is group-partially separable.\n\nFor more information, run the shell command\n\nman cutest_ufn\n\nUsage:\n\nufn(io_err, n, x, f)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\nf:       [OUT] Array{Cdouble, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ugr-Tuple{Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.ugr",
    "category": "Method",
    "text": "ugr\n\nThe ugr subroutine evaluates the gradient of the objective function of the problem decoded from a SIF file by the script sifdecoder at the point X. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to the simple bounds xl≤x≤xu. The objective function is group-partially separable.\n\nFor more information, run the shell command\n\nman cutest_ugr\n\nUsage:\n\nugr(io_err, n, x, g)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\ng:       [OUT] Array{Cdouble, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ugrdh-Tuple{Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Int32,1},Array{Float64,2}}",
    "page": "API",
    "title": "CUTEst.ugrdh",
    "category": "Method",
    "text": "ugrdh\n\nThe ugrdh subroutine evaluates the gradient and Hessian matrix of the objective function of the problem decoded from a SIF file by the script sifdecoder at the point X. This Hessian matrix is stored as a dense matrix. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to the simple bounds xl≤x≤xu. The objective function is group-partially separable.\n\nFor more information, run the shell command\n\nman cutest_ugrdh\n\nUsage:\n\nugrdh(io_err, n, x, g, lh1, h)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\ng:       [OUT] Array{Cdouble, 1}\nlh1:     [IN] Array{Cint, 1}\nh:       [OUT] Array{Cdouble, 2}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ugreh-Tuple{Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.ugreh",
    "category": "Method",
    "text": "ugreh\n\nThe ugreh subroutine evaluates the gradient and Hessian matrix of the objective function of the problem decoded from a SIF file by the script sifdecoder at the point X. This Hessian matrix is stored as a sparse matrix in finite element format H=eΣ1He, where each square symmetric element H sub e involves a small subset of the rows of the Hessian matrix. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to the simple bounds xl≤x≤xu. The objective function is group-partially separable.\n\nFor more information, run the shell command\n\nman cutest_ugreh\n\nUsage:\n\nugreh(io_err, n, x, g, ne, lhe_ptr, he_row_ptr, he_val_ptr, lhe_row, he_row,\n\nlhe_val, he_val, byrows)\n\nio_err:     [OUT] Array{Cint, 1}\nn:          [IN] Array{Cint, 1}\nx:          [IN] Array{Cdouble, 1}\ng:          [OUT] Array{Cdouble, 1}\nne:         [OUT] Array{Cint, 1}\nlhe_ptr:    [IN] Array{Cint, 1}\nhe_row_ptr: [OUT] Array{Cint, 1}\nhe_val_ptr: [OUT] Array{Cint, 1}\nlhe_row:    [IN] Array{Cint, 1}\nhe_row:     [OUT] Array{Cint, 1}\nlhe_val:    [IN] Array{Cint, 1}\nhe_val:     [OUT] Array{Cdouble, 1}\nbyrows:     [IN] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ugrsh-Tuple{Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.ugrsh",
    "category": "Method",
    "text": "ugrsh\n\nThe ugrsh subroutine evaluates the gradient and Hessian matrix of the objective function of the problem decoded from a SIF file by the script sifdecoder at the point X. This Hessian matrix is stored as a sparse matrix in coordinate format. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to the simple bounds xl≤x≤xu. The objective function is group- partially separable.\n\nFor more information, run the shell command\n\nman cutest_ugrsh\n\nUsage:\n\nugrsh(io_err, n, x, g, nnzh, lh, h_val, h_row, h_col)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\ng:       [OUT] Array{Cdouble, 1}\nnnzh:    [OUT] Array{Cint, 1}\nlh:      [IN] Array{Cint, 1}\nh_val:   [OUT] Array{Cdouble, 1}\nh_row:   [OUT] Array{Cint, 1}\nh_col:   [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.uhprod-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.uhprod",
    "category": "Method",
    "text": "uhprod\n\nThe uhprod subroutine forms the product of a vector with the Hessian matrix of the objective function of the problem decoded from a SIF file by the script sifdecoder at the point X. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to the simple bounds xl≤x≤xu. The objective function is group-partially separable.\n\nFor more information, run the shell command\n\nman cutest_uhprod\n\nUsage:\n\nuhprod(io_err, n, goth, x, vector, result)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\ngoth:    [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\nvector:  [IN] Array{Cdouble, 1}\nresult:  [OUT] Array{Cdouble, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.unames-Tuple{Array{Int32,1},Array{Int32,1},Array{UInt8,1},Array{UInt8,2}}",
    "page": "API",
    "title": "CUTEst.unames",
    "category": "Method",
    "text": "unames\n\nThe unames subroutine obtains the names of the problem and its variables. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to the simple bounds xl≤x≤xu. The objective function is group-partially separable.\n\nFor more information, run the shell command\n\nman cutest_unames\n\nUsage:\n\nunames(io_err, n, pname, vname)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\npname:   [OUT] Array{UInt8, 1}\nvname:   [OUT] Array{UInt8, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.uofg-Tuple{Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Float64,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.uofg",
    "category": "Method",
    "text": "uofg\n\nThe uofg subroutine evaluates the value of the objective function of the problem decoded from a SIF file by the script sifdecoder at the point X, and possibly its gradient. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to the simple bounds xl≤x≤xu. The objective function is group- partially separable.\n\nFor more information, run the shell command\n\nman cutest_uofg\n\nUsage:\n\nuofg(io_err, n, x, f, g, grad)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\nf:       [OUT] Array{Cdouble, 1}\ng:       [OUT] Array{Cdouble, 1}\ngrad:    [IN] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ureport-Tuple{Array{Int32,1},Array{Float64,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.ureport",
    "category": "Method",
    "text": "ureport\n\nThe ureport subroutine obtains statistics concerning function evaluation and CPU time used for unconstrained or bound-constrained optimization in a standardized format. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to the simple bounds xl≤x≤xu. The objective function is group- partially separable.\n\nFor more information, run the shell command\n\nman cutest_ureport\n\nUsage:\n\nureport(io_err, calls, time)\n\nio_err:  [OUT] Array{Cint, 1}\ncalls:   [OUT] Array{Cdouble, 1}\ntime:    [OUT] Array{Cdouble, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.usetup-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Float64,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.usetup",
    "category": "Method",
    "text": "usetup\n\nThe usetup subroutine sets up the correct data structures for subsequent computations in the case where the only possible constraints are bound constraints. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to the simple bounds xl≤x≤xu. The objective function is group- partially separable.\n\nFor more information, run the shell command\n\nman cutest_usetup\n\nUsage:\n\nusetup(io_err, input, out, io_buffer, n, x, x_l, x_u)\n\nio_err:    [OUT] Array{Cint, 1}\ninput:     [IN] Array{Cint, 1}\nout:       [IN] Array{Cint, 1}\nio_buffer: [IN] Array{Cint, 1}\nn:         [IN] Array{Cint, 1}\nx:         [OUT] Array{Cdouble, 1}\nx_l:       [OUT] Array{Cdouble, 1}\nx_u:       [OUT] Array{Cdouble, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ush-Tuple{Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.ush",
    "category": "Method",
    "text": "ush\n\nThe ush subroutine evaluates the Hessian matrix of the objective function of the problem decoded from a SIF file by the script sifdecoder at the point X. This Hessian matrix is stored as a sparse matrix in coordinate format. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to the simple bounds xl≤x≤xu. The objective function is group- partially separable.\n\nFor more information, run the shell command\n\nman cutest_ush\n\nUsage:\n\nush(io_err, n, x, nnzh, lh, h_val, h_row, h_col)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nx:       [IN] Array{Cdouble, 1}\nnnzh:    [OUT] Array{Cint, 1}\nlh:      [IN] Array{Cint, 1}\nh_val:   [OUT] Array{Cdouble, 1}\nh_row:   [OUT] Array{Cint, 1}\nh_col:   [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ushp-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.ushp",
    "category": "Method",
    "text": "ushp\n\nThe ushp subroutine evaluates the sparsity pattern of the Hessian matrix of the objective function of the problem, decoded from a SIF file by the script sifdecoder, in coordinate format. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to the simple bounds xl≤x≤xu. The objective function is group-partially separable.\n\nFor more information, run the shell command\n\nman cutest_ushp\n\nUsage:\n\nushp(io_err, n, nnzh, lh, h_row, h_col)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nnnzh:    [OUT] Array{Cint, 1}\nlh:      [IN] Array{Cint, 1}\nh_row:   [OUT] Array{Cint, 1}\nh_col:   [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ushprod-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.ushprod",
    "category": "Method",
    "text": "ushprod\n\nThe ushprod subroutine forms the product of a sparse vector with the Hessian matrix of the objective function of the problem decoded from a SIF file by the script sifdecoder at the point X. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to the simple bounds xl≤x≤xu. The objective function is group-partially separable.\n\nFor more information, run the shell command\n\nman cutest_ushprod\n\nUsage:\n\nushprod(io_err, n, goth, x, nnz_vector, index_nz_vector, vector, nnz_result,\n\nindex_nz_result, result)\n\nio_err:          [OUT] Array{Cint, 1}\nn:               [IN] Array{Cint, 1}\ngoth:            [IN] Array{Cint, 1}\nx:               [IN] Array{Cdouble, 1}\nnnz_vector:      [IN] Array{Cint, 1}\nindex_nz_vector: [IN] Array{Cint, 1}\nvector:          [IN] Array{Cdouble, 1}\nnnz_result:      [OUT] Array{Cint, 1}\nindex_nz_result: [OUT] Array{Cint, 1}\nresult:          [OUT] Array{Cdouble, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.uterminate-Tuple{Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.uterminate",
    "category": "Method",
    "text": "uterminate\n\nThe uterminate subroutine deallocates all workspace arrays created since the last call to usetup.\n\nFor more information, run the shell command\n\nman cutest_uterminate\n\nUsage:\n\nuterminate(io_err)\n\nio_err:  [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.uvartype-Tuple{Array{Int32,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.uvartype",
    "category": "Method",
    "text": "uvartype\n\nThe uvartype subroutine determines the type (continuous, 0-1, integer) of each variable involved in the problem decoded from a SIF file by the script sifdecoder. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to the simple bounds xl≤x≤xu. The objective function is group-partially separable.\n\nFor more information, run the shell command\n\nman cutest_uvartype\n\nUsage:\n\nuvartype(io_err, n, x_type)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nx_type:  [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.varnames-Tuple{Array{Int32,1},Array{Int32,1},Array{UInt8,2}}",
    "page": "API",
    "title": "CUTEst.varnames",
    "category": "Method",
    "text": "varnames\n\nThe varnames subroutine obtains the names of the problem variables. The problem under consideration is to minimize or maximize an objective function f(x) over all x ∈ Rn subject to general equations ci(x)=0, (i ∈ 1,...,mE), general inequalities ci(x)≤ci(x)≤ci(x), (i ∈ mE+1,...,m), and simple bounds xl≤x≤xu. The objective function is group-partially separable and all constraint functions are partially separable.\n\nFor more information, run the shell command\n\nman cutest_varnames\n\nUsage:\n\nvarnames(io_err, n, vname)\n\nio_err:  [OUT] Array{Cint, 1}\nn:       [IN] Array{Cint, 1}\nvname:   [OUT] Array{UInt8, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ccfg!-Tuple{Int64,Int64,Array{Float64,1},Array{Float64,1},Bool,Int64,Int64,Array{Float64,2},Bool}",
    "page": "API",
    "title": "CUTEst.ccfg!",
    "category": "Method",
    "text": "ccfg!(n, m, x, c, jtrans, lcjac1, lcjac2, cjac, grad)\n\nn:       [IN] Int\nm:       [IN] Int\nx:       [IN] Array{Float64, 1}\nc:       [OUT] Array{Float64, 1}\njtrans:  [IN] Bool\nlcjac1:  [IN] Int\nlcjac2:  [IN] Int\ncjac:    [OUT] Array{Float64, 2}\ngrad:    [IN] Bool\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ccfg-Tuple{Int64,Int64,Array{Float64,1},Bool,Int64,Int64,Bool}",
    "page": "API",
    "title": "CUTEst.ccfg",
    "category": "Method",
    "text": "c, cjac = ccfg(n, m, x, jtrans, lcjac1, lcjac2, grad)\n\nn:       [IN] Int\nm:       [IN] Int\nx:       [IN] Array{Float64, 1}\nc:       [OUT] Array{Float64, 1}\njtrans:  [IN] Bool\nlcjac1:  [IN] Int\nlcjac2:  [IN] Int\ncjac:    [OUT] Array{Float64, 2}\ngrad:    [IN] Bool\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ccfsg!-Tuple{Int64,Int64,Array{Float64,1},Array{Float64,1},Int64,Array{Float64,1},Array{Int32,1},Array{Int32,1},Bool}",
    "page": "API",
    "title": "CUTEst.ccfsg!",
    "category": "Method",
    "text": "nnzj = ccfsg!(n, m, x, c, lj, j_val, j_var, j_fun, grad)\n\nn:       [IN] Int\nm:       [IN] Int\nx:       [IN] Array{Float64, 1}\nc:       [OUT] Array{Float64, 1}\nnnzj:    [OUT] Int\nlj:      [IN] Int\nj_val:   [OUT] Array{Float64, 1}\nj_var:   [OUT] Array{Cint, 1}\nj_fun:   [OUT] Array{Cint, 1}\ngrad:    [IN] Bool\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ccfsg-Tuple{Int64,Int64,Array{Float64,1},Int64,Bool}",
    "page": "API",
    "title": "CUTEst.ccfsg",
    "category": "Method",
    "text": "c, nnzj, j_val, j_var, j_fun = ccfsg(n, m, x, lj, grad)\n\nn:       [IN] Int\nm:       [IN] Int\nx:       [IN] Array{Float64, 1}\nc:       [OUT] Array{Float64, 1}\nnnzj:    [OUT] Int\nlj:      [IN] Int\nj_val:   [OUT] Array{Float64, 1}\nj_var:   [OUT] Array{Cint, 1}\nj_fun:   [OUT] Array{Cint, 1}\ngrad:    [IN] Bool\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cchprods!-Tuple{Int64,Int64,Bool,Array{Float64,1},Array{Float64,1},Int64,Array{Float64,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.cchprods!",
    "category": "Method",
    "text": "cchprods!(n, m, goth, x, vector, lchp, chp_val, chp_ind, chp_ptr)\n\nn:       [IN] Int\nm:       [IN] Int\ngoth:    [IN] Bool\nx:       [IN] Array{Float64, 1}\nvector:  [IN] Array{Float64, 1}\nlchp:    [IN] Int\nchp_val: [OUT] Array{Float64, 1}\nchp_ind: [IN] Array{Cint, 1}\nchp_ptr: [IN] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cchprods-Tuple{Int64,Int64,Bool,Array{Float64,1},Array{Float64,1},Int64,Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.cchprods",
    "category": "Method",
    "text": "chp_val = cchprods(n, m, goth, x, vector, lchp, chp_ind, chp_ptr)\n\nn:       [IN] Int\nm:       [IN] Int\ngoth:    [IN] Bool\nx:       [IN] Array{Float64, 1}\nvector:  [IN] Array{Float64, 1}\nlchp:    [IN] Int\nchp_val: [OUT] Array{Float64, 1}\nchp_ind: [IN] Array{Cint, 1}\nchp_ptr: [IN] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ccifg!-Tuple{Int64,Int64,Array{Float64,1},Array{Float64,1},Bool}",
    "page": "API",
    "title": "CUTEst.ccifg!",
    "category": "Method",
    "text": "ci = ccifg!(n, icon, x, gci, grad)\n\nn:       [IN] Int\nicon:    [IN] Int\nx:       [IN] Array{Float64, 1}\nci:      [OUT] Float64\ngci:     [OUT] Array{Float64, 1}\ngrad:    [IN] Bool\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ccifg-Tuple{Int64,Int64,Array{Float64,1},Bool}",
    "page": "API",
    "title": "CUTEst.ccifg",
    "category": "Method",
    "text": "ci, gci = ccifg(n, icon, x, grad)\n\nn:       [IN] Int\nicon:    [IN] Int\nx:       [IN] Array{Float64, 1}\nci:      [OUT] Float64\ngci:     [OUT] Array{Float64, 1}\ngrad:    [IN] Bool\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ccifsg!-Tuple{Int64,Int64,Array{Float64,1},Int64,Array{Float64,1},Array{Int32,1},Bool}",
    "page": "API",
    "title": "CUTEst.ccifsg!",
    "category": "Method",
    "text": "ci, nnzgci = ccifsg!(n, icon, x, lgci, gci_val, gci_var, grad)\n\nn:       [IN] Int\nicon:    [IN] Int\nx:       [IN] Array{Float64, 1}\nci:      [OUT] Float64\nnnzgci:  [OUT] Int\nlgci:    [IN] Int\ngci_val: [OUT] Array{Float64, 1}\ngci_var: [OUT] Array{Cint, 1}\ngrad:    [IN] Bool\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ccifsg-Tuple{Int64,Int64,Array{Float64,1},Int64,Bool}",
    "page": "API",
    "title": "CUTEst.ccifsg",
    "category": "Method",
    "text": "ci, nnzgci, gci_val, gci_var = ccifsg(n, icon, x, lgci, grad)\n\nn:       [IN] Int\nicon:    [IN] Int\nx:       [IN] Array{Float64, 1}\nci:      [OUT] Float64\nnnzgci:  [OUT] Int\nlgci:    [IN] Int\ngci_val: [OUT] Array{Float64, 1}\ngci_var: [OUT] Array{Cint, 1}\ngrad:    [IN] Bool\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cdh!-Tuple{Int64,Int64,Array{Float64,1},Array{Float64,1},Int64,Array{Float64,2}}",
    "page": "API",
    "title": "CUTEst.cdh!",
    "category": "Method",
    "text": "cdh!(n, m, x, y, lh1, h_val)\n\nn:       [IN] Int\nm:       [IN] Int\nx:       [IN] Array{Float64, 1}\ny:       [IN] Array{Float64, 1}\nlh1:     [IN] Int\nh_val:   [OUT] Array{Float64, 2}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cdh-Tuple{Int64,Int64,Array{Float64,1},Array{Float64,1},Int64}",
    "page": "API",
    "title": "CUTEst.cdh",
    "category": "Method",
    "text": "h_val = cdh(n, m, x, y, lh1)\n\nn:       [IN] Int\nm:       [IN] Int\nx:       [IN] Array{Float64, 1}\ny:       [IN] Array{Float64, 1}\nlh1:     [IN] Int\nh_val:   [OUT] Array{Float64, 2}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cdhc!-Tuple{Int64,Int64,Array{Float64,1},Array{Float64,1},Int64,Array{Float64,2}}",
    "page": "API",
    "title": "CUTEst.cdhc!",
    "category": "Method",
    "text": "cdhc!(n, m, x, y, lh1, h_val)\n\nn:       [IN] Int\nm:       [IN] Int\nx:       [IN] Array{Float64, 1}\ny:       [IN] Array{Float64, 1}\nlh1:     [IN] Int\nh_val:   [OUT] Array{Float64, 2}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cdhc-Tuple{Int64,Int64,Array{Float64,1},Array{Float64,1},Int64}",
    "page": "API",
    "title": "CUTEst.cdhc",
    "category": "Method",
    "text": "h_val = cdhc(n, m, x, y, lh1)\n\nn:       [IN] Int\nm:       [IN] Int\nx:       [IN] Array{Float64, 1}\ny:       [IN] Array{Float64, 1}\nlh1:     [IN] Int\nh_val:   [OUT] Array{Float64, 2}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cdimchp-Tuple{}",
    "page": "API",
    "title": "CUTEst.cdimchp",
    "category": "Method",
    "text": "nnzchp = cdimchp()\n\nnnzchp:  [OUT] Int\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cdimen-Tuple{Int64}",
    "page": "API",
    "title": "CUTEst.cdimen",
    "category": "Method",
    "text": "n, m = cdimen(input)\n\ninput:   [IN] Int\nn:       [OUT] Int\nm:       [OUT] Int\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cdimse-Tuple{}",
    "page": "API",
    "title": "CUTEst.cdimse",
    "category": "Method",
    "text": "ne, he_val_ne, he_row_ne = cdimse()\n\nne:        [OUT] Int\nhe_val_ne: [OUT] Int\nhe_row_ne: [OUT] Int\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cdimsh-Tuple{}",
    "page": "API",
    "title": "CUTEst.cdimsh",
    "category": "Method",
    "text": "nnzh = cdimsh()\n\nnnzh:    [OUT] Int\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cdimsj-Tuple{}",
    "page": "API",
    "title": "CUTEst.cdimsj",
    "category": "Method",
    "text": "nnzj = cdimsj()\n\nnnzj:    [OUT] Int\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ceh!-Tuple{Int64,Int64,Array{Float64,1},Array{Float64,1},Int64,Array{Int32,1},Array{Int32,1},Int64,Array{Int32,1},Int64,Array{Float64,1},Bool}",
    "page": "API",
    "title": "CUTEst.ceh!",
    "category": "Method",
    "text": "ne = ceh!(n, m, x, y, lhe_ptr, he_row_ptr, he_val_ptr, lhe_row, he_row, lhe_val, he_val, byrows)\n\nn:          [IN] Int\nm:          [IN] Int\nx:          [IN] Array{Float64, 1}\ny:          [IN] Array{Float64, 1}\nne:         [OUT] Int\nlhe_ptr:    [IN] Int\nhe_row_ptr: [OUT] Array{Cint, 1}\nhe_val_ptr: [OUT] Array{Cint, 1}\nlhe_row:    [IN] Int\nhe_row:     [OUT] Array{Cint, 1}\nlhe_val:    [IN] Int\nhe_val:     [OUT] Array{Float64, 1}\nbyrows:     [IN] Bool\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ceh-Tuple{Int64,Int64,Array{Float64,1},Array{Float64,1},Int64,Int64,Int64,Bool}",
    "page": "API",
    "title": "CUTEst.ceh",
    "category": "Method",
    "text": "ne, he_row_ptr, he_val_ptr, he_row, he_val = ceh(n, m, x, y, lhe_ptr, lhe_row, lhe_val, byrows)\n\nn:          [IN] Int\nm:          [IN] Int\nx:          [IN] Array{Float64, 1}\ny:          [IN] Array{Float64, 1}\nne:         [OUT] Int\nlhe_ptr:    [IN] Int\nhe_row_ptr: [OUT] Array{Cint, 1}\nhe_val_ptr: [OUT] Array{Cint, 1}\nlhe_row:    [IN] Int\nhe_row:     [OUT] Array{Cint, 1}\nlhe_val:    [IN] Int\nhe_val:     [OUT] Array{Float64, 1}\nbyrows:     [IN] Bool\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cfn!-Tuple{Int64,Int64,Array{Float64,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.cfn!",
    "category": "Method",
    "text": "f = cfn!(n, m, x, c)\n\nn:       [IN] Int\nm:       [IN] Int\nx:       [IN] Array{Float64, 1}\nf:       [OUT] Float64\nc:       [OUT] Array{Float64, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cfn-Tuple{Int64,Int64,Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.cfn",
    "category": "Method",
    "text": "f, c = cfn(n, m, x)\n\nn:       [IN] Int\nm:       [IN] Int\nx:       [IN] Array{Float64, 1}\nf:       [OUT] Float64\nc:       [OUT] Array{Float64, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cgr!-Tuple{Int64,Int64,Array{Float64,1},Array{Float64,1},Bool,Array{Float64,1},Bool,Int64,Int64,Array{Float64,2}}",
    "page": "API",
    "title": "CUTEst.cgr!",
    "category": "Method",
    "text": "cgr!(n, m, x, y, grlagf, g, jtrans, lj1, lj2, j_val)\n\nn:       [IN] Int\nm:       [IN] Int\nx:       [IN] Array{Float64, 1}\ny:       [IN] Array{Float64, 1}\ngrlagf:  [IN] Bool\ng:       [OUT] Array{Float64, 1}\njtrans:  [IN] Bool\nlj1:     [IN] Int\nlj2:     [IN] Int\nj_val:   [OUT] Array{Float64, 2}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cgr-Tuple{Int64,Int64,Array{Float64,1},Array{Float64,1},Bool,Bool,Int64,Int64}",
    "page": "API",
    "title": "CUTEst.cgr",
    "category": "Method",
    "text": "g, j_val = cgr(n, m, x, y, grlagf, jtrans, lj1, lj2)\n\nn:       [IN] Int\nm:       [IN] Int\nx:       [IN] Array{Float64, 1}\ny:       [IN] Array{Float64, 1}\ngrlagf:  [IN] Bool\ng:       [OUT] Array{Float64, 1}\njtrans:  [IN] Bool\nlj1:     [IN] Int\nlj2:     [IN] Int\nj_val:   [OUT] Array{Float64, 2}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cgrdh!-Tuple{Int64,Int64,Array{Float64,1},Array{Float64,1},Bool,Array{Float64,1},Bool,Int64,Int64,Array{Float64,2},Int64,Array{Float64,2}}",
    "page": "API",
    "title": "CUTEst.cgrdh!",
    "category": "Method",
    "text": "cgrdh!(n, m, x, y, grlagf, g, jtrans, lj1, lj2, j_val, lh1, h_val)\n\nn:       [IN] Int\nm:       [IN] Int\nx:       [IN] Array{Float64, 1}\ny:       [IN] Array{Float64, 1}\ngrlagf:  [IN] Bool\ng:       [OUT] Array{Float64, 1}\njtrans:  [IN] Bool\nlj1:     [IN] Int\nlj2:     [IN] Int\nj_val:   [OUT] Array{Float64, 2}\nlh1:     [IN] Int\nh_val:   [OUT] Array{Float64, 2}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cgrdh-Tuple{Int64,Int64,Array{Float64,1},Array{Float64,1},Bool,Bool,Int64,Int64,Int64}",
    "page": "API",
    "title": "CUTEst.cgrdh",
    "category": "Method",
    "text": "g, j_val, h_val = cgrdh(n, m, x, y, grlagf, jtrans, lj1, lj2, lh1)\n\nn:       [IN] Int\nm:       [IN] Int\nx:       [IN] Array{Float64, 1}\ny:       [IN] Array{Float64, 1}\ngrlagf:  [IN] Bool\ng:       [OUT] Array{Float64, 1}\njtrans:  [IN] Bool\nlj1:     [IN] Int\nlj2:     [IN] Int\nj_val:   [OUT] Array{Float64, 2}\nlh1:     [IN] Int\nh_val:   [OUT] Array{Float64, 2}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.chcprod!-Tuple{Int64,Int64,Bool,Array{Float64,1},Array{Float64,1},Array{Float64,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.chcprod!",
    "category": "Method",
    "text": "chcprod!(n, m, goth, x, y, vector, result)\n\nn:       [IN] Int\nm:       [IN] Int\ngoth:    [IN] Bool\nx:       [IN] Array{Float64, 1}\ny:       [IN] Array{Float64, 1}\nvector:  [IN] Array{Float64, 1}\nresult:  [OUT] Array{Float64, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.chcprod-Tuple{Int64,Int64,Bool,Array{Float64,1},Array{Float64,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.chcprod",
    "category": "Method",
    "text": "result = chcprod(n, m, goth, x, y, vector)\n\nn:       [IN] Int\nm:       [IN] Int\ngoth:    [IN] Bool\nx:       [IN] Array{Float64, 1}\ny:       [IN] Array{Float64, 1}\nvector:  [IN] Array{Float64, 1}\nresult:  [OUT] Array{Float64, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.chprod!-Tuple{Int64,Int64,Bool,Array{Float64,1},Array{Float64,1},Array{Float64,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.chprod!",
    "category": "Method",
    "text": "chprod!(n, m, goth, x, y, vector, result)\n\nn:       [IN] Int\nm:       [IN] Int\ngoth:    [IN] Bool\nx:       [IN] Array{Float64, 1}\ny:       [IN] Array{Float64, 1}\nvector:  [IN] Array{Float64, 1}\nresult:  [OUT] Array{Float64, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.chprod-Tuple{Int64,Int64,Bool,Array{Float64,1},Array{Float64,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.chprod",
    "category": "Method",
    "text": "result = chprod(n, m, goth, x, y, vector)\n\nn:       [IN] Int\nm:       [IN] Int\ngoth:    [IN] Bool\nx:       [IN] Array{Float64, 1}\ny:       [IN] Array{Float64, 1}\nvector:  [IN] Array{Float64, 1}\nresult:  [OUT] Array{Float64, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cidh!-Tuple{Int64,Array{Float64,1},Int64,Int64,Array{Float64,2}}",
    "page": "API",
    "title": "CUTEst.cidh!",
    "category": "Method",
    "text": "cidh!(n, x, iprob, lh1, h)\n\nn:       [IN] Int\nx:       [IN] Array{Float64, 1}\niprob:   [IN] Int\nlh1:     [IN] Int\nh:       [OUT] Array{Float64, 2}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cidh-Tuple{Int64,Array{Float64,1},Int64,Int64}",
    "page": "API",
    "title": "CUTEst.cidh",
    "category": "Method",
    "text": "h = cidh(n, x, iprob, lh1)\n\nn:       [IN] Int\nx:       [IN] Array{Float64, 1}\niprob:   [IN] Int\nlh1:     [IN] Int\nh:       [OUT] Array{Float64, 2}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cish!-Tuple{Int64,Array{Float64,1},Int64,Int64,Array{Float64,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.cish!",
    "category": "Method",
    "text": "nnzh = cish!(n, x, iprob, lh, h_val, h_row, h_col)\n\nn:       [IN] Int\nx:       [IN] Array{Float64, 1}\niprob:   [IN] Int\nnnzh:    [OUT] Int\nlh:      [IN] Int\nh_val:   [OUT] Array{Float64, 1}\nh_row:   [OUT] Array{Cint, 1}\nh_col:   [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cish-Tuple{Int64,Array{Float64,1},Int64,Int64}",
    "page": "API",
    "title": "CUTEst.cish",
    "category": "Method",
    "text": "nnzh, h_val, h_row, h_col = cish(n, x, iprob, lh)\n\nn:       [IN] Int\nx:       [IN] Array{Float64, 1}\niprob:   [IN] Int\nnnzh:    [OUT] Int\nlh:      [IN] Int\nh_val:   [OUT] Array{Float64, 1}\nh_row:   [OUT] Array{Cint, 1}\nh_col:   [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cjprod!-Tuple{Int64,Int64,Bool,Bool,Array{Float64,1},Array{Float64,1},Int64,Array{Float64,1},Int64}",
    "page": "API",
    "title": "CUTEst.cjprod!",
    "category": "Method",
    "text": "cjprod!(n, m, gotj, jtrans, x, vector, lvector, result, lresult)\n\nn:       [IN] Int\nm:       [IN] Int\ngotj:    [IN] Bool\njtrans:  [IN] Bool\nx:       [IN] Array{Float64, 1}\nvector:  [IN] Array{Float64, 1}\nlvector: [IN] Int\nresult:  [OUT] Array{Float64, 1}\nlresult: [IN] Int\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cjprod-Tuple{Int64,Int64,Bool,Bool,Array{Float64,1},Array{Float64,1},Int64,Int64}",
    "page": "API",
    "title": "CUTEst.cjprod",
    "category": "Method",
    "text": "result = cjprod(n, m, gotj, jtrans, x, vector, lvector, lresult)\n\nn:       [IN] Int\nm:       [IN] Int\ngotj:    [IN] Bool\njtrans:  [IN] Bool\nx:       [IN] Array{Float64, 1}\nvector:  [IN] Array{Float64, 1}\nlvector: [IN] Int\nresult:  [OUT] Array{Float64, 1}\nlresult: [IN] Int\n\n\n\n"
},

{
    "location": "api.html#CUTEst.clfg!-Tuple{Int64,Int64,Array{Float64,1},Array{Float64,1},Array{Float64,1},Bool}",
    "page": "API",
    "title": "CUTEst.clfg!",
    "category": "Method",
    "text": "f = clfg!(n, m, x, y, g, grad)\n\nn:       [IN] Int\nm:       [IN] Int\nx:       [IN] Array{Float64, 1}\ny:       [IN] Array{Float64, 1}\nf:       [OUT] Float64\ng:       [OUT] Array{Float64, 1}\ngrad:    [IN] Bool\n\n\n\n"
},

{
    "location": "api.html#CUTEst.clfg-Tuple{Int64,Int64,Array{Float64,1},Array{Float64,1},Bool}",
    "page": "API",
    "title": "CUTEst.clfg",
    "category": "Method",
    "text": "f, g = clfg(n, m, x, y, grad)\n\nn:       [IN] Int\nm:       [IN] Int\nx:       [IN] Array{Float64, 1}\ny:       [IN] Array{Float64, 1}\nf:       [OUT] Float64\ng:       [OUT] Array{Float64, 1}\ngrad:    [IN] Bool\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cnames-Tuple{Int64,Int64}",
    "page": "API",
    "title": "CUTEst.cnames",
    "category": "Method",
    "text": "pname, vname, cname = cnames(n, m)\n\nn:       [IN] Int\nm:       [IN] Int\npname:   [OUT] UInt8\nvname:   [OUT] Array{UInt8, 1}\ncname:   [OUT] Array{UInt8, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cofg!-Tuple{Int64,Array{Float64,1},Array{Float64,1},Bool}",
    "page": "API",
    "title": "CUTEst.cofg!",
    "category": "Method",
    "text": "f = cofg!(n, x, g, grad)\n\nn:       [IN] Int\nx:       [IN] Array{Float64, 1}\nf:       [OUT] Float64\ng:       [OUT] Array{Float64, 1}\ngrad:    [IN] Bool\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cofg-Tuple{Int64,Array{Float64,1},Bool}",
    "page": "API",
    "title": "CUTEst.cofg",
    "category": "Method",
    "text": "f, g = cofg(n, x, grad)\n\nn:       [IN] Int\nx:       [IN] Array{Float64, 1}\nf:       [OUT] Float64\ng:       [OUT] Array{Float64, 1}\ngrad:    [IN] Bool\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cofsg!-Tuple{Int64,Array{Float64,1},Int64,Array{Float64,1},Array{Int32,1},Bool}",
    "page": "API",
    "title": "CUTEst.cofsg!",
    "category": "Method",
    "text": "f, nnzg = cofsg!(n, x, lg, g_val, g_var, grad)\n\nn:       [IN] Int\nx:       [IN] Array{Float64, 1}\nf:       [OUT] Float64\nnnzg:    [OUT] Int\nlg:      [IN] Int\ng_val:   [OUT] Array{Float64, 1}\ng_var:   [OUT] Array{Cint, 1}\ngrad:    [IN] Bool\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cofsg-Tuple{Int64,Array{Float64,1},Int64,Bool}",
    "page": "API",
    "title": "CUTEst.cofsg",
    "category": "Method",
    "text": "f, nnzg, g_val, g_var = cofsg(n, x, lg, grad)\n\nn:       [IN] Int\nx:       [IN] Array{Float64, 1}\nf:       [OUT] Float64\nnnzg:    [OUT] Int\nlg:      [IN] Int\ng_val:   [OUT] Array{Float64, 1}\ng_var:   [OUT] Array{Cint, 1}\ngrad:    [IN] Bool\n\n\n\n"
},

{
    "location": "api.html#CUTEst.connames-Tuple{Int64}",
    "page": "API",
    "title": "CUTEst.connames",
    "category": "Method",
    "text": "cname = connames(m)\n\nm:       [IN] Int\ncname:   [OUT] Array{UInt8, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.creport!-Tuple{Array{Float64,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.creport!",
    "category": "Method",
    "text": "creport!(calls, time)\n\ncalls:   [OUT] Array{Float64, 1}\ntime:    [OUT] Array{Float64, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.creport-Tuple{}",
    "page": "API",
    "title": "CUTEst.creport",
    "category": "Method",
    "text": "calls, time = creport()\n\ncalls:   [OUT] Array{Float64, 1}\ntime:    [OUT] Array{Float64, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.csetup!-Tuple{Int64,Int64,Int64,Int64,Int64,Array{Float64,1},Array{Float64,1},Array{Float64,1},Array{Float64,1},Array{Float64,1},Array{Float64,1},Array{Int32,1},Array{Int32,1},Int64,Int64,Int64}",
    "page": "API",
    "title": "CUTEst.csetup!",
    "category": "Method",
    "text": "csetup!(input, out, io_buffer, n, m, x, x_l, x_u, y, c_l, c_u, equatn, linear, e_order, l_order, v_order)\n\ninput:     [IN] Int\nout:       [IN] Int\nio_buffer: [IN] Int\nn:         [IN] Int\nm:         [IN] Int\nx:         [OUT] Array{Float64, 1}\nx_l:       [OUT] Array{Float64, 1}\nx_u:       [OUT] Array{Float64, 1}\ny:         [OUT] Array{Float64, 1}\nc_l:       [OUT] Array{Float64, 1}\nc_u:       [OUT] Array{Float64, 1}\nequatn:    [OUT] Array{Bool, 1}\nlinear:    [OUT] Array{Bool, 1}\ne_order:   [IN] Int\nl_order:   [IN] Int\nv_order:   [IN] Int\n\n\n\n"
},

{
    "location": "api.html#CUTEst.csetup-Tuple{Int64,Int64,Int64,Int64,Int64,Int64,Int64,Int64}",
    "page": "API",
    "title": "CUTEst.csetup",
    "category": "Method",
    "text": "x, x_l, x_u, y, c_l, c_u, equatn, linear = csetup(input, out, io_buffer, n, m, e_order, l_order, v_order)\n\ninput:     [IN] Int\nout:       [IN] Int\nio_buffer: [IN] Int\nn:         [IN] Int\nm:         [IN] Int\nx:         [OUT] Array{Float64, 1}\nx_l:       [OUT] Array{Float64, 1}\nx_u:       [OUT] Array{Float64, 1}\ny:         [OUT] Array{Float64, 1}\nc_l:       [OUT] Array{Float64, 1}\nc_u:       [OUT] Array{Float64, 1}\nequatn:    [OUT] Array{Bool, 1}\nlinear:    [OUT] Array{Bool, 1}\ne_order:   [IN] Int\nl_order:   [IN] Int\nv_order:   [IN] Int\n\n\n\n"
},

{
    "location": "api.html#CUTEst.csgr!-Tuple{Int64,Int64,Array{Float64,1},Array{Float64,1},Bool,Int64,Array{Float64,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.csgr!",
    "category": "Method",
    "text": "nnzj = csgr!(n, m, x, y, grlagf, lj, j_val, j_var, j_fun)\n\nn:       [IN] Int\nm:       [IN] Int\nx:       [IN] Array{Float64, 1}\ny:       [IN] Array{Float64, 1}\ngrlagf:  [IN] Bool\nnnzj:    [OUT] Int\nlj:      [IN] Int\nj_val:   [OUT] Array{Float64, 1}\nj_var:   [OUT] Array{Cint, 1}\nj_fun:   [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.csgr-Tuple{Int64,Int64,Array{Float64,1},Array{Float64,1},Bool,Int64}",
    "page": "API",
    "title": "CUTEst.csgr",
    "category": "Method",
    "text": "nnzj, j_val, j_var, j_fun = csgr(n, m, x, y, grlagf, lj)\n\nn:       [IN] Int\nm:       [IN] Int\nx:       [IN] Array{Float64, 1}\ny:       [IN] Array{Float64, 1}\ngrlagf:  [IN] Bool\nnnzj:    [OUT] Int\nlj:      [IN] Int\nj_val:   [OUT] Array{Float64, 1}\nj_var:   [OUT] Array{Cint, 1}\nj_fun:   [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.csgreh!-Tuple{Int64,Int64,Array{Float64,1},Array{Float64,1},Bool,Int64,Array{Float64,1},Array{Int32,1},Array{Int32,1},Int64,Array{Int32,1},Array{Int32,1},Int64,Array{Int32,1},Int64,Array{Float64,1},Bool}",
    "page": "API",
    "title": "CUTEst.csgreh!",
    "category": "Method",
    "text": "nnzj, ne = csgreh!(n, m, x, y, grlagf, lj, j_val, j_var, j_fun, lhe_ptr, he_row_ptr, he_val_ptr, lhe_row, he_row, lhe_val, he_val, byrows)\n\nn:          [IN] Int\nm:          [IN] Int\nx:          [IN] Array{Float64, 1}\ny:          [IN] Array{Float64, 1}\ngrlagf:     [IN] Bool\nnnzj:       [OUT] Int\nlj:         [IN] Int\nj_val:      [OUT] Array{Float64, 1}\nj_var:      [OUT] Array{Cint, 1}\nj_fun:      [OUT] Array{Cint, 1}\nne:         [OUT] Int\nlhe_ptr:    [IN] Int\nhe_row_ptr: [OUT] Array{Cint, 1}\nhe_val_ptr: [OUT] Array{Cint, 1}\nlhe_row:    [IN] Int\nhe_row:     [OUT] Array{Cint, 1}\nlhe_val:    [IN] Int\nhe_val:     [OUT] Array{Float64, 1}\nbyrows:     [IN] Bool\n\n\n\n"
},

{
    "location": "api.html#CUTEst.csgreh-Tuple{Int64,Int64,Array{Float64,1},Array{Float64,1},Bool,Int64,Int64,Int64,Int64,Bool}",
    "page": "API",
    "title": "CUTEst.csgreh",
    "category": "Method",
    "text": "nnzj, j_val, j_var, j_fun, ne, he_row_ptr, he_val_ptr, he_row, he_val = csgreh(n, m, x, y, grlagf, lj, lhe_ptr, lhe_row, lhe_val, byrows)\n\nn:          [IN] Int\nm:          [IN] Int\nx:          [IN] Array{Float64, 1}\ny:          [IN] Array{Float64, 1}\ngrlagf:     [IN] Bool\nnnzj:       [OUT] Int\nlj:         [IN] Int\nj_val:      [OUT] Array{Float64, 1}\nj_var:      [OUT] Array{Cint, 1}\nj_fun:      [OUT] Array{Cint, 1}\nne:         [OUT] Int\nlhe_ptr:    [IN] Int\nhe_row_ptr: [OUT] Array{Cint, 1}\nhe_val_ptr: [OUT] Array{Cint, 1}\nlhe_row:    [IN] Int\nhe_row:     [OUT] Array{Cint, 1}\nlhe_val:    [IN] Int\nhe_val:     [OUT] Array{Float64, 1}\nbyrows:     [IN] Bool\n\n\n\n"
},

{
    "location": "api.html#CUTEst.csgrsh!-Tuple{Int64,Int64,Array{Float64,1},Array{Float64,1},Bool,Int64,Array{Float64,1},Array{Int32,1},Array{Int32,1},Int64,Array{Float64,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.csgrsh!",
    "category": "Method",
    "text": "nnzj, nnzh = csgrsh!(n, m, x, y, grlagf, lj, j_val, j_var, j_fun, lh, h_val, h_row, h_col)\n\nn:       [IN] Int\nm:       [IN] Int\nx:       [IN] Array{Float64, 1}\ny:       [IN] Array{Float64, 1}\ngrlagf:  [IN] Bool\nnnzj:    [OUT] Int\nlj:      [IN] Int\nj_val:   [OUT] Array{Float64, 1}\nj_var:   [OUT] Array{Cint, 1}\nj_fun:   [OUT] Array{Cint, 1}\nnnzh:    [OUT] Int\nlh:      [IN] Int\nh_val:   [OUT] Array{Float64, 1}\nh_row:   [OUT] Array{Cint, 1}\nh_col:   [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.csgrsh-Tuple{Int64,Int64,Array{Float64,1},Array{Float64,1},Bool,Int64,Int64}",
    "page": "API",
    "title": "CUTEst.csgrsh",
    "category": "Method",
    "text": "nnzj, j_val, j_var, j_fun, nnzh, h_val, h_row, h_col = csgrsh(n, m, x, y, grlagf, lj, lh)\n\nn:       [IN] Int\nm:       [IN] Int\nx:       [IN] Array{Float64, 1}\ny:       [IN] Array{Float64, 1}\ngrlagf:  [IN] Bool\nnnzj:    [OUT] Int\nlj:      [IN] Int\nj_val:   [OUT] Array{Float64, 1}\nj_var:   [OUT] Array{Cint, 1}\nj_fun:   [OUT] Array{Cint, 1}\nnnzh:    [OUT] Int\nlh:      [IN] Int\nh_val:   [OUT] Array{Float64, 1}\nh_row:   [OUT] Array{Cint, 1}\nh_col:   [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.csh!-Tuple{Int64,Int64,Array{Float64,1},Array{Float64,1},Int64,Array{Float64,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.csh!",
    "category": "Method",
    "text": "nnzh = csh!(n, m, x, y, lh, h_val, h_row, h_col)\n\nn:       [IN] Int\nm:       [IN] Int\nx:       [IN] Array{Float64, 1}\ny:       [IN] Array{Float64, 1}\nnnzh:    [OUT] Int\nlh:      [IN] Int\nh_val:   [OUT] Array{Float64, 1}\nh_row:   [OUT] Array{Cint, 1}\nh_col:   [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.csh-Tuple{Int64,Int64,Array{Float64,1},Array{Float64,1},Int64}",
    "page": "API",
    "title": "CUTEst.csh",
    "category": "Method",
    "text": "nnzh, h_val, h_row, h_col = csh(n, m, x, y, lh)\n\nn:       [IN] Int\nm:       [IN] Int\nx:       [IN] Array{Float64, 1}\ny:       [IN] Array{Float64, 1}\nnnzh:    [OUT] Int\nlh:      [IN] Int\nh_val:   [OUT] Array{Float64, 1}\nh_row:   [OUT] Array{Cint, 1}\nh_col:   [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cshc!-Tuple{Int64,Int64,Array{Float64,1},Array{Float64,1},Int64,Array{Float64,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.cshc!",
    "category": "Method",
    "text": "nnzh = cshc!(n, m, x, y, lh, h_val, h_row, h_col)\n\nn:       [IN] Int\nm:       [IN] Int\nx:       [IN] Array{Float64, 1}\ny:       [IN] Array{Float64, 1}\nnnzh:    [OUT] Int\nlh:      [IN] Int\nh_val:   [OUT] Array{Float64, 1}\nh_row:   [OUT] Array{Cint, 1}\nh_col:   [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cshc-Tuple{Int64,Int64,Array{Float64,1},Array{Float64,1},Int64}",
    "page": "API",
    "title": "CUTEst.cshc",
    "category": "Method",
    "text": "nnzh, h_val, h_row, h_col = cshc(n, m, x, y, lh)\n\nn:       [IN] Int\nm:       [IN] Int\nx:       [IN] Array{Float64, 1}\ny:       [IN] Array{Float64, 1}\nnnzh:    [OUT] Int\nlh:      [IN] Int\nh_val:   [OUT] Array{Float64, 1}\nh_row:   [OUT] Array{Cint, 1}\nh_col:   [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cshcprod!-Tuple{Int64,Int64,Bool,Array{Float64,1},Array{Float64,1},Int64,Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.cshcprod!",
    "category": "Method",
    "text": "nnz_result = cshcprod!(n, m, goth, x, y, nnz_vector, index_nz_vector, vector, index_nz_result, result)\n\nn:               [IN] Int\nm:               [IN] Int\ngoth:            [IN] Bool\nx:               [IN] Array{Float64, 1}\ny:               [IN] Array{Float64, 1}\nnnz_vector:      [IN] Int\nindex_nz_vector: [IN] Array{Cint, 1}\nvector:          [IN] Array{Float64, 1}\nnnz_result:      [OUT] Int\nindex_nz_result: [OUT] Array{Cint, 1}\nresult:          [OUT] Array{Float64, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cshcprod-Tuple{Int64,Int64,Bool,Array{Float64,1},Array{Float64,1},Int64,Array{Int32,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.cshcprod",
    "category": "Method",
    "text": "nnz_result, index_nz_result, result = cshcprod(n, m, goth, x, y, nnz_vector, index_nz_vector, vector)\n\nn:               [IN] Int\nm:               [IN] Int\ngoth:            [IN] Bool\nx:               [IN] Array{Float64, 1}\ny:               [IN] Array{Float64, 1}\nnnz_vector:      [IN] Int\nindex_nz_vector: [IN] Array{Cint, 1}\nvector:          [IN] Array{Float64, 1}\nnnz_result:      [OUT] Int\nindex_nz_result: [OUT] Array{Cint, 1}\nresult:          [OUT] Array{Float64, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cshp!-Tuple{Int64,Int64,Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.cshp!",
    "category": "Method",
    "text": "nnzh = cshp!(n, lh, h_row, h_col)\n\nn:       [IN] Int\nnnzh:    [OUT] Int\nlh:      [IN] Int\nh_row:   [OUT] Array{Cint, 1}\nh_col:   [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cshp-Tuple{Int64,Int64}",
    "page": "API",
    "title": "CUTEst.cshp",
    "category": "Method",
    "text": "nnzh, h_row, h_col = cshp(n, lh)\n\nn:       [IN] Int\nnnzh:    [OUT] Int\nlh:      [IN] Int\nh_row:   [OUT] Array{Cint, 1}\nh_col:   [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cshprod!-Tuple{Int64,Int64,Bool,Array{Float64,1},Array{Float64,1},Int64,Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.cshprod!",
    "category": "Method",
    "text": "nnz_result = cshprod!(n, m, goth, x, y, nnz_vector, index_nz_vector, vector, index_nz_result, result)\n\nn:               [IN] Int\nm:               [IN] Int\ngoth:            [IN] Bool\nx:               [IN] Array{Float64, 1}\ny:               [IN] Array{Float64, 1}\nnnz_vector:      [IN] Int\nindex_nz_vector: [IN] Array{Cint, 1}\nvector:          [IN] Array{Float64, 1}\nnnz_result:      [OUT] Int\nindex_nz_result: [OUT] Array{Cint, 1}\nresult:          [OUT] Array{Float64, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cshprod-Tuple{Int64,Int64,Bool,Array{Float64,1},Array{Float64,1},Int64,Array{Int32,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.cshprod",
    "category": "Method",
    "text": "nnz_result, index_nz_result, result = cshprod(n, m, goth, x, y, nnz_vector, index_nz_vector, vector)\n\nn:               [IN] Int\nm:               [IN] Int\ngoth:            [IN] Bool\nx:               [IN] Array{Float64, 1}\ny:               [IN] Array{Float64, 1}\nnnz_vector:      [IN] Int\nindex_nz_vector: [IN] Array{Cint, 1}\nvector:          [IN] Array{Float64, 1}\nnnz_result:      [OUT] Int\nindex_nz_result: [OUT] Array{Cint, 1}\nresult:          [OUT] Array{Float64, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.csjprod!-Tuple{Int64,Int64,Bool,Bool,Array{Float64,1},Int64,Array{Int32,1},Array{Float64,1},Int64,Array{Int32,1},Array{Float64,1},Int64}",
    "page": "API",
    "title": "CUTEst.csjprod!",
    "category": "Method",
    "text": "nnz_result = csjprod!(n, m, gotj, jtrans, x, nnz_vector, index_nz_vector, vector, lvector, index_nz_result, result, lresult)\n\nn:               [IN] Int\nm:               [IN] Int\ngotj:            [IN] Bool\njtrans:          [IN] Bool\nx:               [IN] Array{Float64, 1}\nnnz_vector:      [IN] Int\nindex_nz_vector: [IN] Array{Cint, 1}\nvector:          [IN] Array{Float64, 1}\nlvector:         [IN] Int\nnnz_result:      [OUT] Int\nindex_nz_result: [OUT] Array{Cint, 1}\nresult:          [OUT] Array{Float64, 1}\nlresult:         [IN] Int\n\n\n\n"
},

{
    "location": "api.html#CUTEst.csjprod-Tuple{Int64,Int64,Bool,Bool,Array{Float64,1},Int64,Array{Int32,1},Array{Float64,1},Int64,Int64}",
    "page": "API",
    "title": "CUTEst.csjprod",
    "category": "Method",
    "text": "nnz_result, index_nz_result, result = csjprod(n, m, gotj, jtrans, x, nnz_vector, index_nz_vector, vector, lvector, lresult)\n\nn:               [IN] Int\nm:               [IN] Int\ngotj:            [IN] Bool\njtrans:          [IN] Bool\nx:               [IN] Array{Float64, 1}\nnnz_vector:      [IN] Int\nindex_nz_vector: [IN] Array{Cint, 1}\nvector:          [IN] Array{Float64, 1}\nlvector:         [IN] Int\nnnz_result:      [OUT] Int\nindex_nz_result: [OUT] Array{Cint, 1}\nresult:          [OUT] Array{Float64, 1}\nlresult:         [IN] Int\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cstats-Tuple{}",
    "page": "API",
    "title": "CUTEst.cstats",
    "category": "Method",
    "text": "\n\n"
},

{
    "location": "api.html#CUTEst.cterminate-Tuple{}",
    "page": "API",
    "title": "CUTEst.cterminate",
    "category": "Method",
    "text": "cterminate()\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cvartype!-Tuple{Int64,Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.cvartype!",
    "category": "Method",
    "text": "cvartype!(n, x_type)\n\nn:       [IN] Int\nx_type:  [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.cvartype-Tuple{Int64}",
    "page": "API",
    "title": "CUTEst.cvartype",
    "category": "Method",
    "text": "x_type = cvartype(n)\n\nn:       [IN] Int\nx_type:  [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.pname-Tuple{Int64}",
    "page": "API",
    "title": "CUTEst.pname",
    "category": "Method",
    "text": "problem_name = pname(input)\n\ninput:   [IN] Int\npname:   [OUT] UInt8\n\n\n\n"
},

{
    "location": "api.html#CUTEst.probname-Tuple{}",
    "page": "API",
    "title": "CUTEst.probname",
    "category": "Method",
    "text": "pname = probname()\n\npname:   [OUT] String\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ubandh!-Tuple{Int64,Array{Float64,1},Int64,Array{Float64,2},Int64}",
    "page": "API",
    "title": "CUTEst.ubandh!",
    "category": "Method",
    "text": "max_semibandwidth = ubandh!(n, x, semibandwidth, h_band, lbandh)\n\nn:                 [IN] Int\nx:                 [IN] Array{Float64, 1}\nsemibandwidth:     [IN] Int\nh_band:            [OUT] Array{Float64, 2}\nlbandh:            [IN] Int\nmax_semibandwidth: [OUT] Int\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ubandh-Tuple{Int64,Array{Float64,1},Int64,Int64}",
    "page": "API",
    "title": "CUTEst.ubandh",
    "category": "Method",
    "text": "h_band, max_semibandwidth = ubandh(n, x, semibandwidth, lbandh)\n\nn:                 [IN] Int\nx:                 [IN] Array{Float64, 1}\nsemibandwidth:     [IN] Int\nh_band:            [OUT] Array{Float64, 2}\nlbandh:            [IN] Int\nmax_semibandwidth: [OUT] Int\n\n\n\n"
},

{
    "location": "api.html#CUTEst.udh!-Tuple{Int64,Array{Float64,1},Int64,Array{Float64,2}}",
    "page": "API",
    "title": "CUTEst.udh!",
    "category": "Method",
    "text": "udh!(n, x, lh1, h)\n\nn:       [IN] Int\nx:       [IN] Array{Float64, 1}\nlh1:     [IN] Int\nh:       [OUT] Array{Float64, 2}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.udh-Tuple{Int64,Array{Float64,1},Int64}",
    "page": "API",
    "title": "CUTEst.udh",
    "category": "Method",
    "text": "h = udh(n, x, lh1)\n\nn:       [IN] Int\nx:       [IN] Array{Float64, 1}\nlh1:     [IN] Int\nh:       [OUT] Array{Float64, 2}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.udimen-Tuple{Int64}",
    "page": "API",
    "title": "CUTEst.udimen",
    "category": "Method",
    "text": "n = udimen(input)\n\ninput:   [IN] Int\nn:       [OUT] Int\n\n\n\n"
},

{
    "location": "api.html#CUTEst.udimse-Tuple{}",
    "page": "API",
    "title": "CUTEst.udimse",
    "category": "Method",
    "text": "ne, he_val_ne, he_row_ne = udimse()\n\nne:        [OUT] Int\nhe_val_ne: [OUT] Int\nhe_row_ne: [OUT] Int\n\n\n\n"
},

{
    "location": "api.html#CUTEst.udimsh-Tuple{}",
    "page": "API",
    "title": "CUTEst.udimsh",
    "category": "Method",
    "text": "nnzh = udimsh()\n\nnnzh:    [OUT] Int\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ueh!-Tuple{Int64,Array{Float64,1},Int64,Array{Int32,1},Array{Int32,1},Int64,Array{Int32,1},Int64,Array{Float64,1},Bool}",
    "page": "API",
    "title": "CUTEst.ueh!",
    "category": "Method",
    "text": "ne = ueh!(n, x, lhe_ptr, he_row_ptr, he_val_ptr, lhe_row, he_row, lhe_val, he_val, byrows)\n\nn:          [IN] Int\nx:          [IN] Array{Float64, 1}\nne:         [OUT] Int\nlhe_ptr:    [IN] Int\nhe_row_ptr: [OUT] Array{Cint, 1}\nhe_val_ptr: [OUT] Array{Cint, 1}\nlhe_row:    [IN] Int\nhe_row:     [OUT] Array{Cint, 1}\nlhe_val:    [IN] Int\nhe_val:     [OUT] Array{Float64, 1}\nbyrows:     [IN] Bool\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ueh-Tuple{Int64,Array{Float64,1},Int64,Int64,Int64,Bool}",
    "page": "API",
    "title": "CUTEst.ueh",
    "category": "Method",
    "text": "ne, he_row_ptr, he_val_ptr, he_row, he_val = ueh(n, x, lhe_ptr, lhe_row, lhe_val, byrows)\n\nn:          [IN] Int\nx:          [IN] Array{Float64, 1}\nne:         [OUT] Int\nlhe_ptr:    [IN] Int\nhe_row_ptr: [OUT] Array{Cint, 1}\nhe_val_ptr: [OUT] Array{Cint, 1}\nlhe_row:    [IN] Int\nhe_row:     [OUT] Array{Cint, 1}\nlhe_val:    [IN] Int\nhe_val:     [OUT] Array{Float64, 1}\nbyrows:     [IN] Bool\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ufn-Tuple{Int64,Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.ufn",
    "category": "Method",
    "text": "f = ufn(n, x)\n\nn:       [IN] Int\nx:       [IN] Array{Float64, 1}\nf:       [OUT] Float64\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ugr!-Tuple{Int64,Array{Float64,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.ugr!",
    "category": "Method",
    "text": "ugr!(n, x, g)\n\nn:       [IN] Int\nx:       [IN] Array{Float64, 1}\ng:       [OUT] Array{Float64, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ugr-Tuple{Int64,Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.ugr",
    "category": "Method",
    "text": "g = ugr(n, x)\n\nn:       [IN] Int\nx:       [IN] Array{Float64, 1}\ng:       [OUT] Array{Float64, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ugrdh!-Tuple{Int64,Array{Float64,1},Array{Float64,1},Int64,Array{Float64,2}}",
    "page": "API",
    "title": "CUTEst.ugrdh!",
    "category": "Method",
    "text": "ugrdh!(n, x, g, lh1, h)\n\nn:       [IN] Int\nx:       [IN] Array{Float64, 1}\ng:       [OUT] Array{Float64, 1}\nlh1:     [IN] Int\nh:       [OUT] Array{Float64, 2}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ugrdh-Tuple{Int64,Array{Float64,1},Int64}",
    "page": "API",
    "title": "CUTEst.ugrdh",
    "category": "Method",
    "text": "g, h = ugrdh(n, x, lh1)\n\nn:       [IN] Int\nx:       [IN] Array{Float64, 1}\ng:       [OUT] Array{Float64, 1}\nlh1:     [IN] Int\nh:       [OUT] Array{Float64, 2}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ugreh!-Tuple{Int64,Array{Float64,1},Array{Float64,1},Int64,Array{Int32,1},Array{Int32,1},Int64,Array{Int32,1},Int64,Array{Float64,1},Bool}",
    "page": "API",
    "title": "CUTEst.ugreh!",
    "category": "Method",
    "text": "ne = ugreh!(n, x, g, lhe_ptr, he_row_ptr, he_val_ptr, lhe_row, he_row, lhe_val, he_val, byrows)\n\nn:          [IN] Int\nx:          [IN] Array{Float64, 1}\ng:          [OUT] Array{Float64, 1}\nne:         [OUT] Int\nlhe_ptr:    [IN] Int\nhe_row_ptr: [OUT] Array{Cint, 1}\nhe_val_ptr: [OUT] Array{Cint, 1}\nlhe_row:    [IN] Int\nhe_row:     [OUT] Array{Cint, 1}\nlhe_val:    [IN] Int\nhe_val:     [OUT] Array{Float64, 1}\nbyrows:     [IN] Bool\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ugreh-Tuple{Int64,Array{Float64,1},Int64,Int64,Int64,Bool}",
    "page": "API",
    "title": "CUTEst.ugreh",
    "category": "Method",
    "text": "g, ne, he_row_ptr, he_val_ptr, he_row, he_val = ugreh(n, x, lhe_ptr, lhe_row, lhe_val, byrows)\n\nn:          [IN] Int\nx:          [IN] Array{Float64, 1}\ng:          [OUT] Array{Float64, 1}\nne:         [OUT] Int\nlhe_ptr:    [IN] Int\nhe_row_ptr: [OUT] Array{Cint, 1}\nhe_val_ptr: [OUT] Array{Cint, 1}\nlhe_row:    [IN] Int\nhe_row:     [OUT] Array{Cint, 1}\nlhe_val:    [IN] Int\nhe_val:     [OUT] Array{Float64, 1}\nbyrows:     [IN] Bool\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ugrsh!-Tuple{Int64,Array{Float64,1},Array{Float64,1},Int64,Array{Float64,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.ugrsh!",
    "category": "Method",
    "text": "nnzh = ugrsh!(n, x, g, lh, h_val, h_row, h_col)\n\nn:       [IN] Int\nx:       [IN] Array{Float64, 1}\ng:       [OUT] Array{Float64, 1}\nnnzh:    [OUT] Int\nlh:      [IN] Int\nh_val:   [OUT] Array{Float64, 1}\nh_row:   [OUT] Array{Cint, 1}\nh_col:   [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ugrsh-Tuple{Int64,Array{Float64,1},Int64}",
    "page": "API",
    "title": "CUTEst.ugrsh",
    "category": "Method",
    "text": "g, nnzh, h_val, h_row, h_col = ugrsh(n, x, lh)\n\nn:       [IN] Int\nx:       [IN] Array{Float64, 1}\ng:       [OUT] Array{Float64, 1}\nnnzh:    [OUT] Int\nlh:      [IN] Int\nh_val:   [OUT] Array{Float64, 1}\nh_row:   [OUT] Array{Cint, 1}\nh_col:   [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.uhprod!-Tuple{Int64,Bool,Array{Float64,1},Array{Float64,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.uhprod!",
    "category": "Method",
    "text": "uhprod!(n, goth, x, vector, result)\n\nn:       [IN] Int\ngoth:    [IN] Bool\nx:       [IN] Array{Float64, 1}\nvector:  [IN] Array{Float64, 1}\nresult:  [OUT] Array{Float64, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.uhprod-Tuple{Int64,Bool,Array{Float64,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.uhprod",
    "category": "Method",
    "text": "result = uhprod(n, goth, x, vector)\n\nn:       [IN] Int\ngoth:    [IN] Bool\nx:       [IN] Array{Float64, 1}\nvector:  [IN] Array{Float64, 1}\nresult:  [OUT] Array{Float64, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.unames-Tuple{Int64}",
    "page": "API",
    "title": "CUTEst.unames",
    "category": "Method",
    "text": "pname, vname = unames(n)\n\nn:       [IN] Int\npname:   [OUT] UInt8\nvname:   [OUT] Array{UInt8, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.uofg!-Tuple{Int64,Array{Float64,1},Array{Float64,1},Bool}",
    "page": "API",
    "title": "CUTEst.uofg!",
    "category": "Method",
    "text": "f = uofg!(n, x, g, grad)\n\nn:       [IN] Int\nx:       [IN] Array{Float64, 1}\nf:       [OUT] Float64\ng:       [OUT] Array{Float64, 1}\ngrad:    [IN] Bool\n\n\n\n"
},

{
    "location": "api.html#CUTEst.uofg-Tuple{Int64,Array{Float64,1},Bool}",
    "page": "API",
    "title": "CUTEst.uofg",
    "category": "Method",
    "text": "f, g = uofg(n, x, grad)\n\nn:       [IN] Int\nx:       [IN] Array{Float64, 1}\nf:       [OUT] Float64\ng:       [OUT] Array{Float64, 1}\ngrad:    [IN] Bool\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ureport!-Tuple{Array{Float64,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.ureport!",
    "category": "Method",
    "text": "ureport!(calls, time)\n\ncalls:   [OUT] Array{Float64, 1}\ntime:    [OUT] Array{Float64, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ureport-Tuple{}",
    "page": "API",
    "title": "CUTEst.ureport",
    "category": "Method",
    "text": "calls, time = ureport()\n\ncalls:   [OUT] Array{Float64, 1}\ntime:    [OUT] Array{Float64, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.usetup!-Tuple{Int64,Int64,Int64,Int64,Array{Float64,1},Array{Float64,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.usetup!",
    "category": "Method",
    "text": "usetup!(input, out, io_buffer, n, x, x_l, x_u)\n\ninput:     [IN] Int\nout:       [IN] Int\nio_buffer: [IN] Int\nn:         [IN] Int\nx:         [OUT] Array{Float64, 1}\nx_l:       [OUT] Array{Float64, 1}\nx_u:       [OUT] Array{Float64, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.usetup-Tuple{Int64,Int64,Int64,Int64}",
    "page": "API",
    "title": "CUTEst.usetup",
    "category": "Method",
    "text": "x, x_l, x_u = usetup(input, out, io_buffer, n)\n\ninput:     [IN] Int\nout:       [IN] Int\nio_buffer: [IN] Int\nn:         [IN] Int\nx:         [OUT] Array{Float64, 1}\nx_l:       [OUT] Array{Float64, 1}\nx_u:       [OUT] Array{Float64, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ush!-Tuple{Int64,Array{Float64,1},Int64,Array{Float64,1},Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.ush!",
    "category": "Method",
    "text": "nnzh = ush!(n, x, lh, h_val, h_row, h_col)\n\nn:       [IN] Int\nx:       [IN] Array{Float64, 1}\nnnzh:    [OUT] Int\nlh:      [IN] Int\nh_val:   [OUT] Array{Float64, 1}\nh_row:   [OUT] Array{Cint, 1}\nh_col:   [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ush-Tuple{Int64,Array{Float64,1},Int64}",
    "page": "API",
    "title": "CUTEst.ush",
    "category": "Method",
    "text": "nnzh, h_val, h_row, h_col = ush(n, x, lh)\n\nn:       [IN] Int\nx:       [IN] Array{Float64, 1}\nnnzh:    [OUT] Int\nlh:      [IN] Int\nh_val:   [OUT] Array{Float64, 1}\nh_row:   [OUT] Array{Cint, 1}\nh_col:   [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ushp!-Tuple{Int64,Int64,Array{Int32,1},Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.ushp!",
    "category": "Method",
    "text": "nnzh = ushp!(n, lh, h_row, h_col)\n\nn:       [IN] Int\nnnzh:    [OUT] Int\nlh:      [IN] Int\nh_row:   [OUT] Array{Cint, 1}\nh_col:   [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ushp-Tuple{Int64,Int64}",
    "page": "API",
    "title": "CUTEst.ushp",
    "category": "Method",
    "text": "nnzh, h_row, h_col = ushp(n, lh)\n\nn:       [IN] Int\nnnzh:    [OUT] Int\nlh:      [IN] Int\nh_row:   [OUT] Array{Cint, 1}\nh_col:   [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ushprod!-Tuple{Int64,Bool,Array{Float64,1},Int64,Array{Int32,1},Array{Float64,1},Array{Int32,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.ushprod!",
    "category": "Method",
    "text": "nnz_result = ushprod!(n, goth, x, nnz_vector, index_nz_vector, vector, index_nz_result, result)\n\nn:               [IN] Int\ngoth:            [IN] Bool\nx:               [IN] Array{Float64, 1}\nnnz_vector:      [IN] Int\nindex_nz_vector: [IN] Array{Cint, 1}\nvector:          [IN] Array{Float64, 1}\nnnz_result:      [OUT] Int\nindex_nz_result: [OUT] Array{Cint, 1}\nresult:          [OUT] Array{Float64, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.ushprod-Tuple{Int64,Bool,Array{Float64,1},Int64,Array{Int32,1},Array{Float64,1}}",
    "page": "API",
    "title": "CUTEst.ushprod",
    "category": "Method",
    "text": "nnz_result, index_nz_result, result = ushprod(n, goth, x, nnz_vector, index_nz_vector, vector)\n\nn:               [IN] Int\ngoth:            [IN] Bool\nx:               [IN] Array{Float64, 1}\nnnz_vector:      [IN] Int\nindex_nz_vector: [IN] Array{Cint, 1}\nvector:          [IN] Array{Float64, 1}\nnnz_result:      [OUT] Int\nindex_nz_result: [OUT] Array{Cint, 1}\nresult:          [OUT] Array{Float64, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.uterminate-Tuple{}",
    "page": "API",
    "title": "CUTEst.uterminate",
    "category": "Method",
    "text": "uterminate()\n\n\n\n"
},

{
    "location": "api.html#CUTEst.uvartype!-Tuple{Int64,Array{Int32,1}}",
    "page": "API",
    "title": "CUTEst.uvartype!",
    "category": "Method",
    "text": "uvartype!(n, x_type)\n\nn:       [IN] Int\nx_type:  [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.uvartype-Tuple{Int64}",
    "page": "API",
    "title": "CUTEst.uvartype",
    "category": "Method",
    "text": "x_type = uvartype(n)\n\nn:       [IN] Int\nx_type:  [OUT] Array{Cint, 1}\n\n\n\n"
},

{
    "location": "api.html#CUTEst.varnames-Tuple{Int64}",
    "page": "API",
    "title": "CUTEst.varnames",
    "category": "Method",
    "text": "vname = varnames(n)\n\nn:       [IN] Int\nvname:   [OUT] Array{UInt8, 1}\n\n\n\n"
},

{
    "location": "api.html#Core-and-specialized-API-1",
    "page": "API",
    "title": "Core and specialized API",
    "category": "section",
    "text": "Modules = [CUTEst]\nPages   = [\"core_interface.jl\", \"specialized_interface.jl\"]\nOrder   = [:function]"
},

{
    "location": "api.html#CUTEst.sifdecoder-Tuple{String,Vararg{Any,N}}",
    "page": "API",
    "title": "CUTEst.sifdecoder",
    "category": "Method",
    "text": "Decode problem and build shared library.\n\nOptional arguments are passed directly to the SIF decoder. Example:     sifdecoder(\"DIXMAANJ\", \"-param\", \"M=30\").\n\n\n\n"
},

{
    "location": "api.html#Internal-1",
    "page": "API",
    "title": "Internal",
    "category": "section",
    "text": "Modules = [CUTEst]\nPages   = [\"CUTEst.jl\"]\nOrder   = [:function]"
},

{
    "location": "core.html#",
    "page": "Core",
    "title": "Core",
    "category": "page",
    "text": ""
},

{
    "location": "core.html#Working-with-CUTEst-directly-1",
    "page": "Core",
    "title": "Working with CUTEst directly",
    "category": "section",
    "text": "When working with CUTEst, we created a core interface, which is essentially a wrapper for the CUTEst functions. You probably don't want to use that, because the NLPModels interface is much more friendlier, as just as useful. See its tutorial.CUTEst in Fortran defines functions called with cutest_u* or cutest_c*, for the unconstrained and constrained cases, respectively. For each of those, we dropped the cutest_, so the functions cutest_ufn and cutest_cfn are available as ufn and cfn. To use then you have to convert the types using Cint and Cdouble, and pass arrays because of the underlying pointers in Fortran. In practice, there isn't much improvement in calling these or ccalls.Only use these functions if you really know what you're doing."
},

{
    "location": "core.html#Specialized-Interface-1",
    "page": "Core",
    "title": "Specialized Interface",
    "category": "section",
    "text": "The specialized interface takes the original CUTEst's functions and make them more Julian. To explain, let's look at two simple CUTEst functions: cutest_ufn and cutest_cfn.The original cutest_ufn function is defined asCALL CUTEST_ufn(status, n, X, f)wherestatus (output) is an integer signalling whether there was some problem with the CUTEst call;\nn (input) is number of variables in the problem, i.e., the dimension of X;\nX (input) is an array with the current estimate of the solution of the problem;\nf (output) is the value of the objective function evaluated at X.In Julia, we havef = ufn(n, x)In other words, a simplification of the original function, returning what is simple to return, and reducing the parameters to only what is needed.Notice that the problem has to be decoded first. Decoding the problem manually is not advised, as you would have to keep track of the variables, bounds, sizes, library, and closing the problem yourself. It can be done through thorough thought, though.Using nlp is better, because we can keep everything inside it.For cutest_cfn, we would haveCALL CUTEST_cfn(status, n, m, X, f, C)wherestatus (output) is an integer signalling whether there was some problem with the CUTEst call;\nn (input) is number of variables in the problem, i.e., the dimension of X;\nm (input) is number of constraints in the problem, i.e., the dimension of C;\nX (input) is an array with the current estimate of the solution of the problem;\nf (output) is the value of the objective function evaluated at X;\nC (output) is the value of the constraints function evaluated at X.In Julia, we havef, c = cfn(n, m, x)\nf = cfn!(n, m, x, c)As before, we have a simplification of the original call. In addition, there are two new functions here, obtained by addind a ! in front of the function name. These functions modify the vector c storing the result in it. This can be done to save memory, since c will not be recreated. As a convention in Julia, every function that has a ! in the end modifies some input."
},

{
    "location": "core.html#Reference-Guide-1",
    "page": "Core",
    "title": "Reference Guide",
    "category": "section",
    "text": "There are a lot of functions in CUTEst. To see them all, you can check the Technical Report decribing them.Below is a little guide to search the functions documentation. Only some functions are shown. Remember that we are looking into problems in the form \\begin{align} \\min \\quad & f(x) \\\\\n& c_L \\leq c(x) \\leq c_U \\\\\n& \\ell \\leq x \\leq u, \\end{align} with Lagrangian \\begin{align} L(x,y) = f(x) + y^Tc(x). \\end{align}Note: x in the beginning of the function name means that both u and c versions exist.Function Specialized Interface Functions\nf(x) ufn, uofg, cfn, cofg\nnabla f(x) ugr, uofg, cfn, cofg\nnabla^2 f(x) udh, ugrdh, ush, ugrsh, uhprod\nc(x) cfn, ccfg, ccfsg, ccifg\nJ(x) ccfg, ccfsg, ccifg\nnabla^2 L(xy) cdh, cgrdh, csh, cgrsh, chprod\nnabla^2 (y^Tc(x)) chcprodExamplesusing CUTEst\n\nnlp = CUTEstModel(\"ROSENBR\")\nnvar = nlp.meta.nvar\n\nx = nlp.meta.x0\nfx = ufn(nvar, x)ld = nvar # leading dimension\nnnzj, hval, hrow, hcol = ush(nvar, x, ld)finalize(nlp)\nnlp = CUTEstModel(\"HS51\")\nx = nlp.meta.x0\n\n# Checking documentation, in REPL use ?ccfsg\n@doc ccfsgnvar = nlp.meta.nvar\nncon = nlp.meta.ncon\nlj = nlp.meta.nnzj\nc, nnzj, jval, jvar, jfun = ccfsg(nvar, ncon, x, lj, true)\nprintln(\"c = $c\")\nprintln(\"J = $(sparse(jfun, jvar, jval))\")Compare with the NLPModels interfacec = cons(nlp, x)\nJ = jac(nlp, x)\nprintln(\"c = $c\")\nprintln(\"J = $J\")finalize(nlp)"
},

{
    "location": "reference.html#",
    "page": "Reference",
    "title": "Reference",
    "category": "page",
    "text": ""
},

{
    "location": "reference.html#Reference-1",
    "page": "Reference",
    "title": "Reference",
    "category": "section",
    "text": ""
},

]}